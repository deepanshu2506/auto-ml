import pandas as pd
from lib.model_selection.Individual import Individual
from lib.model_selection.fetch_to_keras import create_tunable_model
from lib.model_selection.run_experiment import run_experiment
from lib.model_selection.Configuration import Configuration
from lib.model_selection.ann_encoding import Layers, ProblemType
from lib.Preprocessor import (
    df_to_dataset,
    get_category_encoding_layer,
    get_normalization_layer,
)
from typing import Any, List, Tuple

from utils.enums import Coltype, DataTypes
from pandas.core.frame import DataFrame
from db.models.Dataset import Dataset, DatasetFeature
from lib.Logger.Logger import Logger
from tensorflow.keras import Input, layers
from sklearn.model_selection import KFold

# TODO - write logs to logger


class ModelGenerator:
    def __init__(
        self,
        dataset: Dataset,
        raw_dataset: DataFrame,
        target_feature,
        logger: Logger,
        experiment_count=3,
    ) -> None:
        self.dataset = dataset
        self.raw_dataset = raw_dataset
        self.target_feature = target_feature
        self.logger = logger
        self._exp_results = []
        self._experiment_count = experiment_count
        self.config = None
        self._input_layers = None
        self.preprocessing_layer = None

        self.target_feature_meta: DatasetFeature = list(
            filter(
                lambda x: x.columnName == self.target_feature,
                self.dataset.datasetFields,
            )
        )[0]

    def build(self):
        input_layers, preprocessing_layer = self._get_input_preprocessing_layers()
        self._input_layers = input_layers
        self._preprocessing_layer = preprocessing_layer
        config = self._generate_configuration()
        self.config = config

    def fit(self) -> List[Tuple[float, float, float, float, Individual]]:
        self._exp_results = []

        if (
            self.config == None
            or self._input_layers == None
            or self._preprocessing_layer == None
        ):
            self.logger.error("build is not called")

        for i in range(self._experiment_count):
            best = run_experiment(
                self.raw_dataset,
                self.target_feature,
                configuration=self.config,
                experiment_number=i,
                input_layer=self._input_layers,
                preprocessoring_layer=self._preprocessing_layer,
            )

            cross_val_scores = self._cross_validate(best)
            experiment_result = self.get_experiment_scores(cross_val_scores, best)
            self._exp_results.append(experiment_result)
        return self._exp_results

    def _get_discrete_cols(self) -> List[DatasetFeature]:
        dataset_features = self.dataset.datasetFields
        return filter(
            lambda x: x.columnName != self.target_feature
            and x.colType == Coltype.DISCRETE,
            dataset_features,
        )

    def _get_continous_cols(self) -> List[DatasetFeature]:
        dataset_features = self.dataset.datasetFields
        return filter(
            lambda x: x.columnName != self.target_feature
            and x.colType == Coltype.CONTINOUS,
            dataset_features,
        )

    def _build_input_layer(self, col: DatasetFeature) -> Input:
        input_prop = None
        if col.colType == Coltype.CONTINOUS:
            input_prop = Input(shape=(1,), name=col.columnName)
        else:
            dtype = "string" if col.dataType == DataTypes.STRING else None
            input_prop = Input(shape=(1,), name=col.columnName, dtype=dtype)
        return input_prop

    def _build_discrete_preprocessor(self, col: DatasetFeature):
        input_layer = self._build_input_layer(col)
        dtype = "string" if col.dataType == DataTypes.STRING else "int64"
        encoding_layer = get_category_encoding_layer(
            col.columnName, self.raw_dataset, dtype=dtype, max_tokens=5
        )
        encoded_col = encoding_layer(input_layer)
        return input_layer, encoded_col

    def _build_continous_preprocessor(self, col: DatasetFeature):
        input_layer = self._build_input_layer(col)
        normalization_layer = get_normalization_layer(col.columnName, self.raw_dataset)
        encoded_col = normalization_layer(input_layer)
        return input_layer, encoded_col

    def _get_input_preprocessing_layers(self) -> Tuple[List[Input], Any]:

        all_inputs = []
        encoded_features = []
        discrete_cols = self._get_discrete_cols()
        continous_cols = self._get_continous_cols()

        for col in continous_cols:
            input_layer, preprocessing_layer = self._build_continous_preprocessor(col)
            all_inputs.append(input_layer)
            encoded_features.append(preprocessing_layer)

        for col in discrete_cols:
            input_layer, preprocessing_layer = self._build_discrete_preprocessor(col)
            all_inputs.append(input_layer)
            encoded_features.append(preprocessing_layer)

        all_features = layers.concatenate(encoded_features)

        return all_inputs, all_features

    def _get_metadata(self):
        pass

    def _generate_configuration(self):

        is_discrete = self.target_feature_meta.colType == Coltype.DISCRETE
        Y = self.raw_dataset[self.target_feature]
        output_shape = len(list(Y.value_counts())) if is_discrete else 1
        architecture_type = Layers.FullyConnected
        problem_type = (
            ProblemType.Classification if is_discrete else ProblemType.Regression
        )
        size_scaler = 0.6
        config = Configuration(
            architecture_type,
            problem_type,
            output_shape,
            pop_size=5,
            tournament_size=3,
            max_similar=3,
            epochs=5,
            cross_val=0.2,
            size_scaler=size_scaler,
            max_generations=10,
            binary_selection=True,
            mutation_ratio=0.8,
            similarity_threshold=0.2,
            more_layers_prob=0.7,
            verbose_individuals=True,
            show_model=True,
            verbose_training=1,
            logger=self.logger,
        )
        return config

    def _cross_validate(self, best: Individual):
        kf = KFold(n_splits=5, random_state=None, shuffle=False)

        scores = []

        for train_index, test_index in kf.split(self.raw_dataset):
            dataset_copy = self.raw_dataset.copy()
            target = dataset_copy.pop(self.target_feature)
            target_values = (
                pd.get_dummies(target)
                if self.config.problem_type == ProblemType.Classification
                else target
            )
            best_model = create_tunable_model(
                best.stringModel,
                self.config.problem_type,
                1,
                metrics=[],
                input_layer=self._input_layers,
                preprocessing_layer=self._preprocessing_layer,
            )
            train_X, test_X, train_Y, test_Y = (
                dataset_copy.iloc[train_index],
                dataset_copy.iloc[test_index],
                target_values.iloc[train_index],
                target_values.iloc[test_index],
            )
            train_ds = df_to_dataset(train_X, train_Y)
            test_ds = df_to_dataset(test_X, test_Y)
            history = best_model.fit(train_ds, epochs=20)
            score = best_model.evaluate(test_ds)

            scores.append(score)
        columns = (
            ["loss", "accuracy", "precision", "recall"]
            if best.problem_type == ProblemType.Classification
            else ["loss", "rmse"]
        )
        scores_df = DataFrame(data=scores, columns=columns)
        if best.problem_type == ProblemType.Classification:
            scores_df["accuracy"] = scores_df["accuracy"] * 100
            scores_df["precision"] = scores_df["precision"] * 100
            scores_df["recall"] = scores_df["recall"] * 100
        return scores_df

    def get_experiment_scores(self, scores_df, best_model):

        scores = None
        if self.config.problem_type == ProblemType.Classification:
            scores = (
                scores_df["accuracy"].mean(),
                scores_df["accuracy"].std(),
                scores_df["precision"].mean(),
                scores_df["recall"].mean(),
                best_model,
            )

        else:
            scores = (scores_df["rmse"].mean(), best_model)

        return scores

    def get_best_model():
        pass
