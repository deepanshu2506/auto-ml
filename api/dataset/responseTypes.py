from utils.customFields import MemoryField, EnumField
from flask_restful import fields
from utils.enums import Coltype, DatasetType, DataTypes

userDatasets = {
    "dataset_name": fields.String(attribute="name"),
    "created_at": fields.DateTime(attribute="createdAt"),
    "file_size": MemoryField(attribute="info.fileSize"),
    "tuple_count": fields.Integer(attribute="info.tupleCount"),
    "type": EnumField(enum=DatasetType),
    "id": fields.String(),
}
getUserDatasetsAPIResponse = {"data": fields.List(fields.Nested(userDatasets))}


userDatasetDetails = {
    **userDatasets,
    "datasetFields": fields.List(
        fields.Nested(
            {
                "metrics": fields.Nested(
                    {
                        "min": fields.Float,
                        "max": fields.Float,
                        "mean": fields.Float,
                        "median": fields.Float,
                        "std_dev": fields.Float(attribute="stdDeviation"),
                        "unique_values": fields.Integer(attribute="uniqueValues"),
                        "missing_values": fields.Integer(attribute="missingValues"),
                        "samples": fields.List(fields.String),
                        "outlier_count": fields.Integer,
                        "value_percentage": fields.Raw(),
                    }
                ),
                "column_order": fields.Integer(attribute="columnOrder"),
                "column_name": fields.String(attribute="columnName"),
                "datatype": EnumField(enum=DataTypes, attribute="dataType"),
                "column_description": fields.String(attribute="columnDescription"),
                "column_Type": EnumField(Coltype, attribute="colType"),
            }
        )
    ),
}
