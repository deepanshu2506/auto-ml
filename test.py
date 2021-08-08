from lib.imputer import Imputer, KNNImputer, MaxFrequencyImputer, MeanImputer
from pandas.core.frame import DataFrame
from werkzeug.datastructures import FileStorage
from services.FileService import MockFileService

fileService = MockFileService()

col_name = "ocean_proximity"
df: DataFrame = fileService.convert_to_dataset(FileStorage(stream=None))
print(df[col_name].isna().sum())

imputer: Imputer = KNNImputer(col_name)
df = imputer.impute(df)
print(df[col_name].isna().sum())
