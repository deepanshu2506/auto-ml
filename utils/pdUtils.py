from numpy.core.numerictypes import issubdtype
from pandas.core import series
from pandas.core.frame import DataFrame
from utils.enums import AggregationMethods, DataTypes
import numpy


def get_datatype(dtype):
    if dtype is numpy.dtype(numpy.float64) or dtype is numpy.dtype(numpy.int64):
        return DataTypes.NUMBER
    else:
        return DataTypes.STRING


def perform_aggregation(df: DataFrame, aggregate_func: AggregationMethods) -> DataFrame:
    func = getattr(df, aggregate_func.value)
    return func()
    pass
