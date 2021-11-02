from datetime import datetime
from mongoengine import Document
from mongoengine.base.fields import ObjectIdField
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
from lib.model_selection.ann_encoding import ProblemType
from utils.enums import Coltype, DataTypes, TrainingStates
from utils.customFields import (
    ArrayCountField,
    EnumField as OutputEnumField,
)
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
    ProblemType = EnumField(ProblemType)
    classes = DynamicField()
    feature_importance = DictField()
    created_by = ObjectIdField()

    @classmethod
    def to_output(cls, detailed=True):
        summary_fields = {
            "epochs": fields.Integer(),
            "target_col": fields.String(),
            "state": OutputEnumField(TrainingStates),
            "created_at": fields.DateTime(),
            "name": fields.String(),
            "num_classes": ArrayCountField(attribute="classes"),
            "type": OutputEnumField(ProblemType, attribute="ProblemType"),
            "id": fields.String(),
        }
        detailed_fields = {
            "classes": fields.List(fields.Raw()),
            "model_location": fields.String(),
            "feature_importance": fields.Raw(),
            "features": fields.List(fields.Nested(ModelFeatures.to_output())),
        }
        output_fields = (
            {**summary_fields, **detailed_fields} if detailed else summary_fields
        )
        return output_fields
