from functools import reduce
from numpy.core.numerictypes import issubdtype
from pandas import Series
from pandas.core.frame import DataFrame
from utils.enums import AggregationMethods, Coltype, DataTypes
import numpy


def get_datatype(dtype):
    if dtype is numpy.dtype(numpy.float64) or dtype is numpy.dtype(numpy.int64):
        return DataTypes.NUMBER
    else:
        return DataTypes.STRING


TOP_N_COUNT = 10
UNIQUE_RATIO_THRESHOLD = 0.05
MAX_TOP_N_UNIQUE_RATIO_THRESHOLD = 0.8


def get_col_type(column_data: Series, col_dtype: DataTypes) -> Coltype:
    if col_dtype is DataTypes.STRING:
        return Coltype.DISCRETE
    else:
        # unique_count / total_count
        unique_ratio = 1.0 * column_data.nunique() / column_data.count()

        # top n values freq / total_count
        top_n_unique_ratio = (
            1.0 * column_data.value_counts(normalize=True).head(TOP_N_COUNT).sum()
        )
        return (
            Coltype.DISCRETE
            if (
                unique_ratio < UNIQUE_RATIO_THRESHOLD
                or top_n_unique_ratio > MAX_TOP_N_UNIQUE_RATIO_THRESHOLD
            )
            else Coltype.CONTINOUS
        )


def is_discrete_auto_impute(column_data):

    # unique_count / total_count
    unique_ratio = 1.0 * column_data.nunique() / column_data.count()

    # top n values freq / total_count
    top_n_unique_ratio = (
        1.0 * column_data.value_counts(normalize=True).head(TOP_N_COUNT).sum()
    )
    return (
        unique_ratio < UNIQUE_RATIO_THRESHOLD
        or top_n_unique_ratio > MAX_TOP_N_UNIQUE_RATIO_THRESHOLD,
        unique_ratio,
        top_n_unique_ratio,
    )


def perform_aggregation(df: DataFrame, aggregate_func: AggregationMethods) -> DataFrame:
    func = getattr(df, aggregate_func.value)
    return func()
    pass

def build_query(query: list) -> str:

    def reduce_func(acc, curr):
        rhs = curr["rhs"]
        try:
            rhs = float(rhs)
        except ValueError:
            rhs = '"' + rhs + '"'
        if(acc):
            return acc + f" and `{curr['lhs']}` {curr['op']} {rhs}"
        else:
            return acc + f"`{curr['lhs']}` {curr['op']} {rhs}"

    q = reduce(reduce_func, query, "")
    print(q)
    return q

    # if "lhs" in query and "rhs" in query:
    #     rhs = query["rhs"]
    #     try:
    #         rhs = float(rhs)
    #     except ValueError:
    #         rhs = '"' + rhs + '"'

    #     return f"`{query['lhs']}` {query['op']} {rhs}"
    # else:
    #     return f"{build_query(query['expr1'])} {(query.get('op') or '').lower()} {build_query(query['expr2']) if query.get('expr2') else ''}"


def getCorrelation(df: DataFrame):
    # correlation matrix
    matrix = df.corr()
    return numpy.around(matrix, decimals=3)

 
    