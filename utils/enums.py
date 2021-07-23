import enum


class DatasetType(enum.Enum):
    CSV = "csv"
    SQL = "sql"


class DataTypes(enum.Enum):
    NUMBER = "NUMBER"
    STRING = "STRING"


class AggregationMethods(enum.Enum):
    SUM = "sum"
    MEAN = "mean"
    COUNT = "count"
    MIN = "min"
    MAX = "max"
    UNIQUE = "unique"
