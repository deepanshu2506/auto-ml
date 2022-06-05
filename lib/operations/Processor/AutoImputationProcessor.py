from typing import List
from pandas import DataFrame
from db.models.Dataset import Dataset, DatasetFeature
from lib.Preprocessor import DataFrameOrdinalencoder, OrdinalEncoderProps
from lib.auto_imputer import AutoImputer, AutoImputerFactory
from lib.operations.OperationOutput import OperationOutput
from lib.operations.inputTypes import AutoImputationInput, SingleImputationInput
from utils.enums import Coltype, JobTypes
from utils.pdUtils import is_discrete_auto_impute
from .BaseProcessor import BaseProcessor


class AutoImputationProcessor(BaseProcessor):
    def __init__(self, imputer_model, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.imputer_model = imputer_model

    def _get_model_features(self, dataset: Dataset, dataset_frame, target_col_name):
        model_input_features = {}
        model_input_features["rows_count"] = dataset.info.tupleCount
        model_input_features["cols_count"] = len(dataset.datasetFields)
        (
            model_input_features["is_classification"],
            model_input_features["unique_ratio"],
            model_input_features["top_n_unique_ratio"],
        ) = is_discrete_auto_impute(dataset_frame[target_col_name])
        discrete_count = 0
        continous_count = 0
        null_count = 0

        for field in dataset.datasetFields:
            field: DatasetFeature
            null = field.metrics.missingValues
            null_count += null
            if field.colType == Coltype.DISCRETE:
                discrete_count += 1
            else:
                continous_count += 1

        perc_null = (null_count / model_input_features["rows_count"]) * 100

        model_input_features["percent_null"] = perc_null
        model_input_features["discrete_count"] = discrete_count
        model_input_features["continous_count"] = continous_count
        return model_input_features, null_count

    def _get_imputation_stats(self, dataset: Dataset):
        imputed_col_stats = []

        imputed_col_stats = map(
            lambda feature: {
                "col_name": feature.columnName,
                "imputed_count": feature.metrics.missingValues,
            },
            filter(lambda f: f.metrics.missingValues != 0, dataset.datasetFields),
        )

        return list(imputed_col_stats)

    def _build_encoder(self, dataset: Dataset) -> DataFrameOrdinalencoder:
        encoder_props = list(
            map(lambda f: OrdinalEncoderProps(f.columnName), dataset.datasetFields)
        )
        encoder = DataFrameOrdinalencoder(dataset, encoder_props)
        return encoder

    def get_imputer(self, model_input_features) -> AutoImputer:
        imputer = AutoImputerFactory.get_auto_imputer(
            model_input_features, loaded_model=self.imputer_model
        )
        return imputer

    def impute_dataset(
        self, dataset: DataFrame, dataset_meta: Dataset, imputer: AutoImputer
    ):
        encoder = self._build_encoder(dataset=dataset_meta)
        encoded_dataframe = encoder.fit(dataset)
        imputed_df = imputer.impute(encoded_dataframe)
        imputed_dataset = encoder.inverse_transform(imputed_df)
        return imputed_dataset

    def process(
        self,
        dataset_meta: Dataset,
        jobType: JobTypes,
        dataset: DataFrame,
        inputs: AutoImputationInput,
    ) -> OperationOutput:

        output = OperationOutput(
            operation_name=jobType, inputs=inputs, dataset_meta=dataset_meta
        )

        model_input_features, null_count = self._get_model_features(
            dataset=dataset_meta,
            dataset_frame=dataset,
            target_col_name=inputs.target_col_name,
        )

        print(model_input_features)

        if null_count != 0:
            imputer = self.get_imputer(model_input_features)
            imputation_type = imputer.__class__.__name__

            imputed_df = self.impute_dataset(
                dataset=dataset, dataset_meta=dataset_meta, imputer=imputer
            )
            process_stats = {
                "imputer_type": imputation_type,
                "affected_col_stats": self._get_imputation_stats(dataset_meta),
            }
            affected_columns = list(
                map(lambda f: f["col_name"], process_stats["affected_col_stats"])
            )
            output.processStats = process_stats
            output.affected_columns = affected_columns
            output.raw_dataset = imputed_df
            pass
        else:
            output.raw_dataset = dataset

        return output
