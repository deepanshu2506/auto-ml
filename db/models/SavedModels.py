from datetime import datetime
from mongoengine import Document
from mongoengine.document import EmbeddedDocument
from mongoengine.fields import (
    DateTimeField,
    DictField,
    DynamicField,
    EmbeddedDocumentListField,
    EnumField,
    IntField,
    ListField,
    ReferenceField,
    StringField,
)
from db.models.ModelSelectionJobs import ModelSelectionJob
from utils.enums import Coltype, DataTypes, TrainingStates
from utils.customFields import MemoryField, EnumField as OutputEnumField
from flask_restful import fields


class ModelFeatures(EmbeddedDocument):
    name = StringField()
    dataType = EnumField(DataTypes)
    type = EnumField(Coltype)
    allowed_Values = ListField()

    @classmethod
    def to_output(cls):
        return {
            "name": fields.String(),
            "dataType": OutputEnumField(enum=DataTypes),
            "type": OutputEnumField(enum=Coltype),
            "allowed_Values": fields.List(fields.String()),
        }


class SavedModel(Document):
    epochs = IntField()
    target_col = StringField()
    job = ReferenceField(ModelSelectionJob)
    features = EmbeddedDocumentListField(ModelFeatures)
    model_location = StringField()
    created_at = DateTimeField(default=datetime.utcnow())
    name = StringField()
    state = EnumField(TrainingStates)
    architecture = DynamicField()
    classes = DynamicField()
    feature_importance = DictField()

    @classmethod
    def to_output(cls):
        return {
            "epochs": fields.Integer(),
            "target_col": fields.String(),
            "features": fields.List(fields.Nested(ModelFeatures.to_output())),
            "model_location": fields.String(),
            "created_at": fields.DateTime(),
            "name": fields.String(),
            "state": OutputEnumField(TrainingStates),
            "classes": fields.List(fields.Raw()),
            "feature_importance": fields.Raw(),
        }
