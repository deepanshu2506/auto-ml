from enum import Enum
from lib.Logger.Logger import Logger
from lib.model_selection.ann_encoding import ProblemType


class Configuration:
    def __init__(
        self,
        architecture_type,
        problem_type,
        input_shape,
        output_shape,
        pop_size,
        tournament_size,
        max_similar,
        size_scaler=1,
        epochs=3,
        cross_val=0.2,
        more_layers_prob=0.5,
        max_generations=1,
        binary_selection=True,
        mutation_ratio=0.4,
        similarity_threshold=0.9,
        verbose_individuals=False,
        show_model=False,
        verbose_training=0,
        logger=None,
    ):

        self._architecture_type = architecture_type
        self._problem_type: ProblemType = (
            problem_type  # 1 for regression, 2 for classification
        )
        self._input_shape = input_shape
        self._output_shape = output_shape  # If regression applies, number of classes
        self._cross_val = cross_val
        self._more_layers_prob = more_layers_prob
        self._max_generations = max_generations
        self._pop_size = pop_size
        self._tournament_size = tournament_size
        self._binary_selection = binary_selection
        self._mutation_ratio = mutation_ratio
        self._similarity_threshold = similarity_threshold
        self._max_similar = max_similar
        self._epochs = epochs
        self._size_scaler = size_scaler
        self._verbose_individuals = verbose_individuals
        self._verbose_training = verbose_training
        self._show_model = show_model
        self._logger: Logger = logger

    @property
    def architecture_type(self):
        return self._architecture_type

    @architecture_type.setter
    def architecture_type(self, architecture_type):
        self._architecture_type = architecture_type

    @property
    def problem_type(self) -> ProblemType:
        return self._problem_type

    @problem_type.setter
    def problem_type(self, problem_type: ProblemType):
        self._problem_type = problem_type

    @property
    def input_shape(self):
        return self._input_shape

    @input_shape.setter
    def input_shape(self, input_shape):
        self._input_shape = input_shape

    @property
    def output_shape(self):
        return self._output_shape

    @output_shape.setter
    def output_shape(self, output_shape):
        self._output_shape = output_shape

    @property
    def epochs(self):
        return self._epochs

    @epochs.setter
    def epochs(self, epochs):
        self._epochs = epochs

    @property
    def cross_val(self):
        return self._cross_val

    @cross_val.setter
    def cross_val(self, cross_val):
        self._cross_val = cross_val

    @property
    def more_layers_prob(self):
        return self._more_layers_prob

    @more_layers_prob.setter
    def more_layers_prob(self, more_layers_prob):
        self._more_layers_prob = more_layers_prob

    @property
    def size_scaler(self):
        return self._size_scaler

    @size_scaler.setter
    def size_scaler(self, size_scaler):
        self._size_scaler = size_scaler

    @property
    def max_generations(self):
        return self._max_generations

    @max_generations.setter
    def max_generations(self, max_generations):
        self._max_generations = max_generations

    @property
    def pop_size(self):
        return self._pop_size

    @pop_size.setter
    def pop_size(self, pop_size):
        self._pop_size = pop_size

    @property
    def tournament_size(self):
        return self._tournament_size

    @tournament_size.setter
    def tournament_size(self, tournament_size):
        self._tournament_size = tournament_size

    @property
    def binary_selection(self):
        return self._binary_selection

    @binary_selection.setter
    def binary_selection(self, binary_selection):
        self._binary_selection = binary_selection

    @property
    def mutation_ratio(self):
        return self._mutation_ratio

    @mutation_ratio.setter
    def mutation_ratio(self, mutation_ratio):
        self._mutation_ratio = mutation_ratio

    @property
    def max_similar(self):
        return self._max_similar

    @max_similar.setter
    def max_similar(self, max_similar):
        self._max_similar = max_similar

    @property
    def similarity_threshold(self):
        return self._similarity_threshold

    @similarity_threshold.setter
    def similarity_threshold(self, similarity_threshold):
        self._similarity_threshold = similarity_threshold

    @property
    def verbose_individuals(self):
        return self._verbose_individuals

    @verbose_individuals.setter
    def verbose_individuals(self, verbose_individuals):
        self._verbose_individuals = verbose_individuals

    @property
    def verbose_training(self):
        return self._verbose_training

    @verbose_training.setter
    def verbose_training(self, verbose_training):
        self._verbose_training = verbose_training

    @property
    def show_model(self):
        return self._show_model

    @show_model.setter
    def show_model(self, show_model):
        self._show_model = show_model

    @property
    def logger(self) -> Logger:
        return self._logger

    @logger.setter
    def show_model(self, logger):
        self._logger = logger


class Phases(Enum):
    PREPROCESS = "PREPROCESS"
    INIT = "INIT"
    RUNNING_EXPT = "RUNNING_EXPT"
    CROSS_VALIDATION = "CROSS_VALIDATION"
    COMPILING_BEST = "COMPILING BEST"
