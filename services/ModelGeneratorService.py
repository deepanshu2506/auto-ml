from datetime import datetime
import threading
from utils.enums import ModelSelectionJobStates
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
from lib.Logger import Logger


class ModelGeneratorService:
    def __init__(
        self, fileService: FileService, datasetService: DatasetService
    ) -> None:
        self.datasetService = datasetService
        self.fileService = fileService

    def generateModels(self, user_id, dataset_id, target_col):
        print("starting")
        modelThread = threading.Thread(
            target=self._generateModel, args=(user_id, dataset_id, target_col)
        )
        modelThread.start()

    def _generateModel(self, user_id, dataset_id, target_col):
        dataset = self.datasetService.find_by_id(dataset_id, user_id)
        raw_dataset = self.fileService.get_dataset_from_url(dataset.datasetLocation)
        modelSelectionJob = ModelSelectionJob()
        modelSelectionJob.dataset = dataset
        logger = SocketLogger(user_id)

        modelGenerator = ModelGenerator(
            dataset=dataset,
            raw_dataset=raw_dataset,
            target_feature=target_col,
            logger=logger,
        )
        modelGenerator.build()
        algo_config = modelGenerator.config

        modelSelectionJob.architecture_type = algo_config.architecture_type
        modelSelectionJob.problemType = algo_config.problem_type
        modelSelectionJob.num_classes = algo_config.output_shape
        modelSelectionJob.configuration = algo_config.get_serializable()
        modelSelectionJob.save()
        results = modelGenerator.fit()
        if results:

            def get_generatedModel(res):
                generatedModel = GeneratedModel(
                    accuracy=res[0],
                    precision=res[2],
                    recall=res[3],
                    fitness_score=res[3].fitness_score,
                )
                generatedModel.accuracy_dev = res[1]
                generatedModel.model_arch = res[3].stringModel
                generatedModel.trainable_params = res[3]._raw_size
                return generatedModel

            generatedModels = map(get_generatedModel, results)
            modelSelectionJob.results = ModelSelectionJobResult(models=generatedModels)
            modelSelectionJob.jobEndtime = datetime.utcnow()
            modelSelectionJob.state = ModelSelectionJobStates.COMPLETED
            modelSelectionJob.save()
        else:
            modelSelectionJob.state = ModelSelectionJobStates.ERROR
            modelSelectionJob.save()
            pass

    def exportModel(self, job_id: str, model_id):
        pass
