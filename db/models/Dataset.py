from mongoengine.base.fields import ObjectIdField
from mongoengine.document import EmbeddedDocument
from utils.enums import DataTypes, DatasetType
from mongoengine.fields import (
    EmbeddedDocumentField,
    EmbeddedDocumentListField,
    EnumField,
    FloatField,
    IntField,
    ListField,
    StringField,
)


from mongoengine import Document


class DatasetFeatureMetrics(EmbeddedDocument):
    min = FloatField()
    max = FloatField()
    mean = FloatField()
    median = FloatField()
    stdDeviation = FloatField()
    uniqueValues = IntField()
    missingValues = IntField()
    samples = ListField(max_length=5)


class DatasetFeature(EmbeddedDocument):
    columnOrder = IntField()
    columnName = StringField()
    dataType = EnumField(DataTypes)
    columnDescription = StringField()
    metrics = EmbeddedDocumentField(DatasetFeatureMetrics)
    pass


class DatasetInfo(EmbeddedDocument):
    fileSize = FloatField()
    tupleCount = IntField()


class Dataset(Document):
    type = EnumField(DatasetType, default=DatasetType.CSV)
    name = StringField()
    datasetLocation = StringField()
    datasetFields = EmbeddedDocumentListField(DatasetFeature)
    info = EmbeddedDocumentField(DatasetInfo)
    createdBy = ObjectIdField()
