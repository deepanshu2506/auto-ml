import numpy as np
import math
from tensorflow.keras.models import Model
from sklearn.model_selection import train_test_split
import lib.model_selection.ann_encoding as ann_encoding


class Individual:
    def __init__(
        self,
        ind_label,
        problem_type,
        stringModel,
        used_activations,
        tModel=None,
        raw_score=0,
        raw_size=0,
        fitness=0,
    ):
        self._stringModel = stringModel
        self._tModel: Model = tModel
        self._raw_score = raw_score
        self._normalized_score = raw_score
        self._raw_size = raw_size
        self._fitness = fitness
        self._problem_type = problem_type
        self._individual_label = ind_label
        self._used_activations = used_activations
        self._checksum_vector = np.zeros(1)

    def compute_raw_scores(
        self,
        X,
        Y,
        epochs,
        cross_validation_ratio,
    ):

        trainable_count = np.sum(
            [np.prod(v.get_shape()) for v in self._tModel.trainable_weights]
        )

        self._raw_size = trainable_count

        scores = self.partial_run(
            X,
            Y,
            cross_validation_ratio,
            epochs,
        )

        accuracy = scores[1]
        metric_score = accuracy
        if self.problem_type == ann_encoding.ProblemType.Classification:
            precision = scores[2]
            recall = scores[3]
            sum = precision + recall
            if sum == 0:
                metric_score = 0
            else:
                metric_score = (precision * recall) / sum
        elif self.problem_type == ann_encoding.ProblemType.Regression:
            metric_score = accuracy

        self._raw_score = metric_score
        self._normalized_score = metric_score

    def compute_fitness(self, size_scaler):

        round_up_to = 3

        # Round up to the first 3 digits before computing log
        rounding_scaler = 10 ** round_up_to

        if self._raw_size > rounding_scaler:
            trainable_count = round(self._raw_size / rounding_scaler) * rounding_scaler
        else:
            trainable_count = self._raw_size

        scaled_score = self.normalized_score

        # For classification estimate the error which is between 0 and 1
        if self._problem_type == ann_encoding.ProblemType.Classification:
            metric_score = (
                1 - scaled_score
            ) * 10  # Multiply by 10 to have a better scaling. I still need to find an appropriate scaling
        else:
            metric_score = (
                scaled_score * 10
            )  # Multiply by 10 to have a better scaling. I still need to find an appropiate scaling

        size_score = math.log10(trainable_count)

        metric_scaler = 1 - size_scaler
        # Scalarization of multiobjective version of the fitness function
        self._fitness = metric_scaler * metric_score + size_scaler * size_score

    def compute_checksum_vector(self):

        self._checksum_vector = np.zeros(len(self._stringModel[0]))

        for layer in self._stringModel:

            layer_type = layer[0]
            self._checksum_vector[0] = self._checksum_vector[0] + layer_type.value

            useful_components = ann_encoding.useful_components_by_layer[layer_type]
            for index in useful_components:
                self._checksum_vector[index] = (
                    self._checksum_vector[index] + layer[index]
                )

    def partial_run(
        self,
        X,
        Y,
        cross_validation_ratio=0.2,
        epochs=20,
    ):

        X_train, X_test, Y_train, Y_test = train_test_split(
            X, Y, test_size=cross_validation_ratio
        )

        self.tModel.fit(
            X_train,
            Y_train,
            epochs=epochs,
            verbose=1,
        )
        scores = self._tModel.evaluate(
            X_test,
            Y_test,
            verbose=1,
        )
        return scores
        # print(cScores)

        """
		self._tModel.evaluate_model(cross_validation=False)
		cScores = self._tModel.scores
		#print(cScores)
		"""

    def __str__(self):

        str_repr1 = "\n\nString Model\n" + str(self._stringModel) + "\n"
        str_repr2 = "<Individual(label = '%s' fitness = %.4f, raw_score = %.4f, normalized_score = %.4f, raw_size = %d)>" % (
            self._individual_label,
            self._fitness,
            self._raw_score,
            self._normalized_score,
            self._raw_size,
        )
        str_repr3 = "\nChecksum vector: " + str(self._checksum_vector)

        str_repr = str_repr1 + str_repr2 + str_repr3

        return str_repr

    # property definition

    @property
    def tModel(self) -> Model:
        return self._tModel

    @tModel.setter
    def tModel(self, tModel):
        self._tModel = tModel

    @property
    def raw_score(self):
        return self._raw_score

    @raw_score.setter
    def raw_score(self, raw_score):
        self._raw_score = raw_score

    @property
    def normalized_score(self):
        return self._normalized_score

    @normalized_score.setter
    def normalized_score(self, normalized_score):
        self._normalized_score = normalized_score

    @property
    def raw_size(self):
        return self._raw_size

    @raw_size.setter
    def raw_size(self, raw_size):
        self._raw_size = raw_size

    @property
    def fitness(self):
        return self._fitness

    @fitness.setter
    def fitness(self, fitness):
        self._fitness = fitness

    @property
    def stringModel(self):
        return self._stringModel

    @stringModel.setter
    def stringModel(self, stringModel):
        self._stringModel = stringModel

    @property
    def problem_type(self):
        return self._problem_type

    @problem_type.setter
    def problem_type(self, problem_type):
        self._problem_type = problem_type

    @property
    def individual_label(self):
        return self._individual_label

    @individual_label.setter
    def individual_label(self, individual_label):
        self._individual_label = individual_label

    @property
    def used_activations(self):
        return self._used_activations

    @used_activations.setter
    def used_activations(self, used_activations):
        self._used_activations = used_activations

    @property
    def checksum_vector(self):
        return self._checksum_vector

    @checksum_vector.setter
    def checksum_vector(self, checksum_vector):
        self._checksum_vector = checksum_vector
