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

    pass


class ModelSelectionJobResult(DynamicEmbeddedDocument):
    models = EmbeddedDocumentListField(GeneratedModel)
    pass


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
