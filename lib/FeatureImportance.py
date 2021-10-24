from pandas.core.series import Series
from tensorflow.keras.models import Model
from tensorflow import convert_to_tensor
from db.models.Dataset import Dataset, DatasetFeature
from pandas import DataFrame
import numpy
from utils.enums import Coltype, DataTypes


class ImportanceExtractor:
    def __init__(self, dataset: Dataset, model: Model, target_col: str) -> None:
        self.dataset = dataset
        self.model = model
        self.target_col = target_col

        target_feature: DatasetFeature = list(
            filter(lambda x: x.columnName == target_col, dataset.datasetFields)
        )[0]
        self.problem_type: Coltype = target_feature.colType

    def _get_median(self, df: DataFrame):
        dataset_input_features = filter(
            lambda x: x.columnName != self.target_col, self.dataset.datasetFields
        )
        median_values = {}
        for field in dataset_input_features:
            field: DatasetFeature = field
            median = None
            if field.dataType is DataTypes.STRING:
                median = df[field.columnName].value_counts().idxmax()
            else:
                median = numpy.nanmedian(df[field.columnName])

            median_values[field.columnName] = median
        return median_values

    def _generate_variants(self, column_data: Series, feature: DatasetFeature):
        column_variants = None
        if feature.colType is Coltype.DISCRETE:
            column_variants = column_data.unique()
        else:
            minimum, maximum = column_data.min(), column_data.max()
            column_variants = numpy.arange(minimum, maximum, (maximum - minimum) / 100)

        return column_variants

    def _build_variation(self, column_name, variants, median_values):
        variations = []
        for variant in variants:
            variation_dict = {**median_values}
            variation_dict[column_name] = variant
            variations.append(variation_dict)
        return variations

    def _build_tensor(self, inputs):
        tensor = {
            key: convert_to_tensor([input[key] for input in inputs])
            for key in inputs[0]
        }
        return tensor

    def _continous_target_impact(self, model_output):
        return float(max(model_output) - min(model_output))

    def _discrete_target_impact(self, model_output):
        df = DataFrame(model_output)
        impact = (df.max() - df.min()).sum()
        return float(impact)

    def _get_field_importance(self, res):

        impact = (
            self._discrete_target_impact(res)
            if self.problem_type == Coltype.DISCRETE
            else self._continous_target_impact(res)
        )
        return impact

    def extract(self, df: DataFrame):
        median_values = self._get_median(df)
        impacts = {}
        dataset_input_features = list(
            filter(
                lambda x: x.columnName != self.target_col, self.dataset.datasetFields
            )
        )
        input_counts = []
        agg_inputs = []
        for field in dataset_input_features:
            field: DatasetFeature = field
            column_variants = self._generate_variants(df[field.columnName], field)
            inputs = self._build_variation(
                field.columnName, column_variants, median_values
            )
            input_counts.append(len(inputs))
            agg_inputs.extend(inputs)

        tensor = self._build_tensor(agg_inputs)
        res = self.model.predict(tensor)
        start = 0
        for idx, field in enumerate(dataset_input_features):
            field_res = res[start : start + input_counts[idx]]
            start = start + input_counts[idx]
            impacts[field.columnName] = float(self._get_field_importance(field_res))
        return impacts
