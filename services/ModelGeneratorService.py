from datetime import datetime
import threading
from pandas.core.frame import DataFrame
import pandas as pd
from db.models.Dataset import Dataset, DatasetFeature
from db.models.SavedModels import ModelFeatures, SavedModel
from lib.FeatureImportance import ImportanceExtractor
from lib.Preprocessor import KerasPreProcessingEncoder, df_to_dataset
from lib.model_selection.ann_encoding import Layers, ProblemType
from lib.model_selection.fetch_to_keras import create_tunable_model
from utils.enums import Coltype, ModelSelectionJobStates, TrainingStates
from db.models.ModelSelectionJobs import (
    GeneratedModel,
    ModelSelectionJob,
    ModelSelectionJobResult,
)
from lib.model_selection.Configuration import Configuration
from lib.model_selection.model_selection import ModelGenerator
from lib.Logger.SocketLogger import SocketLogger
from services.DatasetService import DatasetService
from services.FileService import FileService
from utils.exceptions import ModelNotFound, UnimputedDatasetError
import matplotlib.pyplot as plt


class ModelGeneratorService:
    def __init__(
        self, fileService: FileService, datasetService: DatasetService
    ) -> None:
        self.datasetService = datasetService
        self.fileService = fileService

    def generateModels(self, user_id, dataset_id, target_col) -> ModelSelectionJob:
        dataset = self.datasetService.find_by_id(dataset_id, user_id)
        raw_dataset = self.fileService.get_dataset_from_url(dataset.datasetLocation)
        modelSelectionJob = ModelSelectionJob(created_by=user_id)
        modelSelectionJob.dataset = dataset
        logger = SocketLogger(user_id)
        null_count = raw_dataset.isnull().sum().sum()
        if null_count > 0:
            null_cols = raw_dataset.columns[raw_dataset.isnull().any()].tolist()
            raise UnimputedDatasetError(data={"cols": null_cols})
        modelGenerator = ModelGenerator(
            dataset=dataset,
            raw_dataset=raw_dataset,
            target_feature=target_col,
            logger=logger,
            experiment_count=3,
        )
        modelGenerator.build()
        algo_config = modelGenerator.config

        modelSelectionJob.architecture_type = algo_config.architecture_type
        modelSelectionJob.problemType = algo_config.problem_type
        modelSelectionJob.num_classes = algo_config.output_shape
        modelSelectionJob.configuration = algo_config.get_serializable()
        modelSelectionJob.state = ModelSelectionJobStates.SUBMITTED
        modelSelectionJob.target_col = target_col

        modelSelectionJob.save()
        modelThread = threading.Thread(
            target=self._generateModel, args=(modelGenerator, modelSelectionJob)
        )
        modelThread.start()
        return modelSelectionJob

    def _generateModel(
        self, modelGenerator: ModelGenerator, modelSelectionJob: ModelSelectionJob
    ):
        modelSelectionJob.state = ModelSelectionJobStates.RUNNING
        modelSelectionJob.save()

        results = modelGenerator.fit()
        if results:

            def get_generatedModel(res):
                generatedModel = GeneratedModel()
                if modelSelectionJob.problemType == ProblemType.Classification:

                    generatedModel.accuracy = res[0]
                    generatedModel.precision = res[2]
                    generatedModel.recall = res[3]
                    generatedModel.fitness_score = res[-1].fitness
                    generatedModel.accuracy_dev = res[1]
                else:
                    generatedModel.error = res[0]
                generatedModel.model_arch = self._encode_model(res[-1].stringModel)
                generatedModel.trainable_params = res[-1].raw_size
                return generatedModel

            generatedModels = list(map(get_generatedModel, results))
            modelSelectionJob.results = ModelSelectionJobResult(models=generatedModels)
            modelSelectionJob.jobEndtime = datetime.utcnow()
            modelSelectionJob.state = ModelSelectionJobStates.COMPLETED
            modelSelectionJob.save()
        else:
            modelSelectionJob.state = ModelSelectionJobStates.ERROR
            modelSelectionJob.save()
            pass

    def _encode_model(self, model):
        encoded = []
        for layer in model:
            encoded.append([layer[0].value, *layer[1:]])
        return encoded

    def _decode_model(self, model):
        encoded = []
        for layer in model:
            encoded.append([Layers(layer[0]), *layer[1:]])
        return encoded

    def exportModel(self, job: ModelSelectionJob, model_id, user_id, **kwargs):

        model: GeneratedModel = None

        def _buildModelFeature(
            datasetFeature: DatasetFeature, raw_dataset: DataFrame
        ) -> ModelFeatures:
            modelFeature = ModelFeatures(
                name=datasetFeature.columnName,
                dataType=datasetFeature.dataType,
                type=datasetFeature.colType,
            )
            if datasetFeature.colType == Coltype.DISCRETE:

                modelFeature.allowed_Values = list(
                    map(
                        lambda x: str(x),
                        raw_dataset[datasetFeature.columnName].unique(),
                    )
                )
            return modelFeature

        for model in job.results.models:
            if str(model.model_id) == model_id:
                model = model

        if model:
            epochs = kwargs.get("epochs", 20)
            dataset: Dataset = job.dataset
            raw_dataset = self.fileService.get_dataset_from_url(dataset.datasetLocation)
            features = list(
                map(
                    lambda field: _buildModelFeature(field, raw_dataset),
                    dataset.datasetFields,
                )
            )
            model_name = kwargs.get("model_name", f"{dataset.name}_model")

            classes = (
                pd.get_dummies(raw_dataset[job.target_col]).columns.tolist()
                if job.problemType == ProblemType.Classification
                else None
            )
            savedModel = SavedModel(
                epochs=epochs,
                target_col=job.target_col,
                job=job,
                name=model_name,
                state=TrainingStates.SUBMITTED,
                features=features,
                architecture=model.model_arch,
                classes=classes,
                ProblemType=job.problemType,
                created_by=user_id,
            )
            savedModel.save()

            input_encoder = KerasPreProcessingEncoder(
                dataset=dataset, target_feature=job.target_col, raw_dataset=raw_dataset
            )

            modelThread = threading.Thread(
                target=self._train_model,
                args=(model.model_arch, raw_dataset, job, input_encoder, savedModel),
                kwargs=kwargs,
            )
            modelThread.start()
            return savedModel

        else:
            raise ModelNotFound

    def _train_model(
        self,
        model_arch,
        dataset,
        job: ModelSelectionJob,
        encoder: KerasPreProcessingEncoder,
        savedModel: SavedModel,
        **kwargs,
    ):

        savedModel.state = TrainingStates.STARTED
        savedModel.save()
        model_arch = self._decode_model(model_arch)
        target_col_meta: DatasetFeature = list(
            filter(lambda x: x.columnName == job.target_col, job.dataset.datasetFields)
        )[0]
        problem_type = (
            ProblemType.Classification
            if target_col_meta.colType == Coltype.DISCRETE
            else ProblemType.Regression
        )

        (
            input_layers,
            preprocessing_layer,
        ) = encoder.get_input_preprocessing_layers()
        model = create_tunable_model(
            model_arch,
            problem_type,
            1,
            metrics=[],
            input_layer=input_layers,
            preprocessing_layer=preprocessing_layer,
            prod=True,
        )

        train_ds = df_to_dataset(
            dataframe=dataset,
            problemType=problem_type,
            target_variable=job.target_col,
        )
        epochs = kwargs.get("epochs") or 20
        print(epochs)
        model.fit(train_ds, epochs=epochs)
        model_location = self.fileService.save_model(model, job.id, savedModel.id)
        savedModel.model_location = model_location
        savedModel.state = TrainingStates.ANALYZING
        savedModel.save()
        importanceExtractor = ImportanceExtractor(
            dataset=job.dataset, model=model, target_col=job.target_col
        )
        impact = importanceExtractor.extract(dataset)
        print(impact)
        savedModel.feature_importance = impact
        savedModel.state = TrainingStates.COMPLETED
        savedModel.save()
