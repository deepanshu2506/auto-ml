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


def build_query(query: dict) -> str:
    if "lhs" in query and "rhs" in query:
        rhs = query["rhs"]
        try:
            rhs = float(rhs)
        except ValueError:
            rhs = '"' + rhs + '"'
        return f"`{query['lhs']}` {query['op']} {rhs}"
    else:
        return f"{build_query(query['expr1'])} {query['op'].lower()} {build_query(query['expr2'])}"
