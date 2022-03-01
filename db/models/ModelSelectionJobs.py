from datetime import datetime
from mongoengine.base.fields import ObjectIdField
from utils.enums import ModelSelectionJobStates
from db.models.Dataset import Dataset
from bson.objectid import ObjectId
from mongoengine.document import DynamicEmbeddedDocument
from lib.model_selection.ann_encoding import Layers, ProblemType
from mongoengine import Document
from mongoengine.fields import (
    BooleanField,
    DateTimeField,
    DynamicField,
    EmbeddedDocumentField,
    EmbeddedDocumentListField,
    EnumField,
    FloatField,
    IntField,
    ReferenceField,
    StringField,
)
from flask_restful import fields
from utils.customFields import (
    EnumField as OutputEnumField,
)

class ModelSelectionConfiguration(DynamicEmbeddedDocument):
    architecture_type = EnumField(Layers)
    problem_type = EnumField(ProblemType)
    output_shape = IntField()
    pop_size = IntField()
    tournament_size = IntField()
    max_similar = IntField
    size_scaler = FloatField()
    epochs = IntField()
    cross_val = FloatField(min_value=0, max_value=1)
    more_layers_prob = FloatField(min_value=0, max_value=1)
    max_generations = IntField()
    binary_selection = BooleanField()
    mutation_ratio = FloatField(min_value=0, max_value=1)
    similarity_threshold = FloatField(min_value=0, max_value=1)
    @classmethod
    def to_output(cls):
        return {
            "architecture_type" :  OutputEnumField(enum=Layers),
            "problem_type" :OutputEnumField(enum=ProblemType),
            "output_shape" : fields.Integer(),
            "pop_size" :  fields.Integer(),
            "tournament_size" :  fields.Integer(),
            "max_similar" :  fields.Integer(),
            "size_scaler" : fields.Float(),
            "epochs" :  fields.Integer(),
            "cross_val" : fields.Float(),
            "more_layers_prob" :fields.Float(),
            "max_generations" :  fields.Integer(),
            "binary_selection" :fields.Boolean(),
            "mutation_ratio" : fields.Float(),
            "similarity_threshold" :fields.Float(),
        }

class GeneratedModel(DynamicEmbeddedDocument):
    accuracy = FloatField()
    precision = FloatField()
    recall = FloatField()
    fitness_score = FloatField()
    model_arch = DynamicField()
    trainable_params = IntField()
    error = FloatField()
    model_id = ObjectIdField(
        required=True, default=ObjectId, unique=True, primary_key=True, sparse=True
    )
    @classmethod
    def to_output(cls):
        return {
            "accuracy" : fields.Float(),
            "precision" : fields.Float(),
            "recall" : fields.Float(),
            "fitness_score" : fields.Float(),
            "model_arch" :fields.Raw(),
            "trainable_params" : fields.Integer(),
            "error" : fields.Float(),
            "model_id" : fields.String(attribute="model.id"),
        }

class ModelSelectionJobResult(DynamicEmbeddedDocument):
    models = EmbeddedDocumentListField(GeneratedModel)
    @classmethod
    def to_output(cls):
        return {
            "models":fields.List(fields.Nested(GeneratedModel.to_output())),
        }



class ModelSelectionJob(Document):
    dataset = ReferenceField(Dataset)
    startedAt = DateTimeField(default=datetime.utcnow)
    state = EnumField(ModelSelectionJobStates)
    jobEndtime = DateTimeField()
    architecture_type = EnumField(Layers)
    problemType = EnumField(ProblemType)
    num_classes = IntField(min_value=1)
    target_col = StringField()
    configuration = EmbeddedDocumentField(ModelSelectionConfiguration)
    results = EmbeddedDocumentField(ModelSelectionJobResult)
    created_by = ObjectIdField()
    pass

    @classmethod
    def to_output(cls):
        return {
            "dataset_id" : fields.String(attribute="dataset.id"),
            "startedAt" : fields.DateTime(),
            "state" :  OutputEnumField(ModelSelectionJobStates),
            "jobEndtime" : fields.DateTime(),
            "architecture_type" : OutputEnumField(enum=Layers),
            "problemType" :  OutputEnumField(enum=ProblemType),
            "num_classes" : fields.Integer(),
            "target_col" : fields.String(),
            "configuration" : fields.Nested(ModelSelectionConfiguration.to_output()),
            "results" : fields.Nested(ModelSelectionJobResult.to_output()),           
        }
    
    @classmethod
    def joblist_output(cls, detailed=True):
        summary_fields = {
            # "dataset_id" : fields.String(attribute="job.dataset"),
            # "dataset_id" : fields.Nested(Dataset.to_output()),
            "startedAt" : fields.DateTime(),
            "state" :  OutputEnumField(ModelSelectionJobStates),
            "jobEndtime" : fields.DateTime(),
            "target_col" : fields.String(),
        }
        dataset_fields = {
            "dataset_name": fields.List(fields.Nested(Dataset.to_output())),
        }
        # detailed_fields = {
        #     "classes": fields.List(fields.Raw()),
        #     "feature_importance": fields.Raw(),
        #     "features": fields.List(fields.Nested(ModelFeatures.to_output())),
        #     "dataset_id": fields.String(attribute="job.dataset.id"),
        #     "model_selection_job_id": fields.String(attribute="job.id"),
        #     "architecture": fields.Raw(),
        #     "param_count": fields.Integer(),
        #     "metrics": fields.Nested(ModelMetrics.to_output()),
        # # }
        output_fields = (
            {**summary_fields, **dataset_fields} if detailed else summary_fields
        )
        # return summary_fields
        return output_fields

