from datetime import datetime
from mongoengine import Document
from mongoengine.document import EmbeddedDocument
from mongoengine.fields import (
    DateTimeField,
    EmbeddedDocumentListField,
    EnumField,
    IntField,
    ListField,
    ReferenceField,
    StringField,
)
from db.models.ModelSelectionJobs import ModelSelectionJob
from utils.enums import DataTypes


class ModelFeatures(EmbeddedDocument):
    name = StringField()
    dataType = EnumField(DataTypes)
    allowed_Values = ListField(StringField())


class SavedModel(Document):
    epochs = IntField()
    target_col = StringField
    job = ReferenceField(ModelSelectionJob)
    features = EmbeddedDocumentListField(ModelFeatures)
    model_location = StringField()
    created_at = DateTimeField(datetime.utcnow())
    name = StringField()
