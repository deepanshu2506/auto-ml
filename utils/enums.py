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


class Coltype(enum.Enum):
    DISCRETE = "discrete"
    CONTINOUS = "continous"


class ImputationMethods(enum.Enum):
    MEAN = "mean"
    MEDIAN = "median"
    VALUE = "value"
    KNN = "knn"
    MAX_FREQUENCY = "max_freq"


class DatasetStates(enum.Enum):
    RAW = "raw"
    IMPUTED = "imputed"
    PARTIALLY_IMPUTED = "partially_imputed"


class JobTypes(enum.Enum):
    SINGLE_COL_IMPUTATION = "single_col_impute"
    MULTI_COL_IMPUTATION = "multi_col_impute"

class ModelSelectionJobStates(enum.Enum):
    SUBMITTED = 'submitted'
    RUNNING = "running"
    ERROR = "error"
    ABORTED = "aborted"
    COMPLETED = "completed"
    
class TrainingStates(enum.Enum):
    SUBMITTED = 'submitted'
    STARTED = 'started'
    COMPLETED = 'completed'