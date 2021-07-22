from numpy.core.numerictypes import issubdtype
from utils.enums import DataTypes
import numpy


def get_datatype(dtype):
    if dtype is numpy.dtype(numpy.float64) or dtype is numpy.dtype(numpy.int64):
        return DataTypes.NUMBER
    else:
        return DataTypes.STRING
