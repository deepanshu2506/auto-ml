from os import rename
from random import sample
from pandas import DataFrame, Series


def get_outlier_count(series: Series):
    lower_quantile = series.quantile(0.25)
    upper_quantile = series.quantile(0.75)
    iqr = upper_quantile - lower_quantile
    below_lower_quartile = sum(
        i < (lower_quantile - (1.5 * iqr)) for i in series.tolist()
    )
    above_upper_quartile = sum(
        i > (upper_quantile + (1.5 * iqr)) for i in series.tolist()
    )

    return below_lower_quartile + above_upper_quartile


def get_value_percentage_dict(column: Series):
    column_values_clean = column.fillna("None", inplace=False)
    value_percentage = dict(
        (column_values_clean.value_counts() / len(column_values_clean)) * 100
    )
    value_percentage = {str(key): value for key, value in value_percentage.items()}

    return value_percentage


def get_samples(column: Series, n=10):
    samples = column.sample(min(n, len(column)))
    return samples


def replace_boolean(df: DataFrame):
    mask = df.applymap(type) != bool
    d = {True: "T", False: "F"}
    return df.where(mask, df.replace(d))


def clean_col_names(dataset_raw: DataFrame):
    columns = dataset_raw.columns.values.tolist()
    rename_map = {column: column.replace(" ", "_") for column in columns}
    proccessed_dataset = dataset_raw.rename(columns=rename_map, inplace=False)
    return proccessed_dataset


def replace_nulls(df: DataFrame, place_holder):
    return df.replace({place_holder: None}, inplace=False)
