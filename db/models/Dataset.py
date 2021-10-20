import datetime
from mongoengine.base.fields import ObjectIdField
from mongoengine.document import DynamicEmbeddedDocument, EmbeddedDocument
from utils.enums import Coltype, DataTypes, DatasetStates, DatasetType, JobTypes
from mongoengine.fields import (
    BooleanField,
    DateTimeField,
    EmbeddedDocumentField,
    EmbeddedDocumentListField,
    EnumField,
    FloatField,
    IntField,
    ListField,
    StringField,
    DictField,
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
    value_percentage = DictField()
    outlier_count = IntField()


class DatasetFeature(EmbeddedDocument):
    columnOrder = IntField()
    columnName = StringField()
    dataType = EnumField(DataTypes)
    columnDescription = StringField()
    metrics = EmbeddedDocumentField(DatasetFeatureMetrics)
    colType = EnumField(Coltype)


class DatasetInfo(EmbeddedDocument):
    fileSize = FloatField()
    tupleCount = IntField()


class JobStats(DynamicEmbeddedDocument):
    jobStart = DateTimeField()
    jobEnd = DateTimeField()
    pass


class DatasetJob(EmbeddedDocument):
    jobType = EnumField(JobTypes)
    stats = EmbeddedDocumentField(JobStats)
    runOn = DateTimeField(default=datetime.datetime.utcnow)


class Dataset(Document):
    type = EnumField(DatasetType, default=DatasetType.CSV)
    name = StringField()
    state = EnumField(DatasetStates, default=DatasetStates.RAW)
    datasetLocation = StringField()
    datasetFields = EmbeddedDocumentListField(DatasetFeature)
    info = EmbeddedDocumentField(DatasetInfo)
    createdBy = ObjectIdField()
    createdAt = DateTimeField(default=datetime.datetime.utcnow)
    jobs = EmbeddedDocumentListField(DatasetJob)

    isDeleted = BooleanField(default=False)
