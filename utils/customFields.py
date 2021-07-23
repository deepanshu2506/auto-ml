from enum import Enum
from flask_restful import fields
from math import log2

_suffixes = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]


def file_size(size):
    order = int(log2(size) / 10) if size else 0
    return "{:.4g} {}".format(size / (1 << (order * 10)), _suffixes[order])


class MemoryField(fields.Raw):
    def format(self, value):
        return file_size(value)


class EnumField(fields.Raw):
    def __init__(self, enum: Enum, default=None, attribute=None):
        self.enum = enum
        super().__init__(default=default, attribute=attribute)

    def format(self, value):
        if not isinstance(value, self.enum):
            raise Exception("invalid value")
        return value.value
