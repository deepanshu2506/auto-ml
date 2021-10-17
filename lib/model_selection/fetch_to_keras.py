from tensorflow.python.keras.metrics import CategoricalAccuracy, Precision, Recall
from tensorflow.python.keras.models import Model
from .ann_encoding import Layers, ProblemType, activations
from tensorflow.keras.layers import Dense, Conv2D, LSTM, Dropout, MaxPooling2D, Flatten
from tensorflow.keras import Sequential, Model
from tensorflow.keras.optimizers import Adam


def create_tunable_model(
    model_genotype,
    problem_type,
    model_number,
    input_layer,
    preprocessing_layer,
    metrics=None,
    prod=False,
):
    model_name = (
        ("categorical" if problem_type == ProblemType.Classification else "regression")
        + "_SN_"
        + str(model_number)
    )

    model_genotype = decode_genotype(model_genotype, problem_type, model_name)
    model_output = model_genotype(preprocessing_layer)
    model = Model(input_layer, model_output)

    model = get_compiled_model(
        model,
        problem_type,
        optimizer_params=[],
        metrics=metrics,
        prod=prod,
    )

    return model


def population_to_keras(population, input_layer, preprocessing_layer):

    for i in range(len(population)):

        individual = population[i]

        tModel = create_tunable_model(
            individual.stringModel,
            individual.problem_type,
            i + 1,
            input_layer=input_layer,
            preprocessing_layer=preprocessing_layer,
        )

        individual.tModel = tModel


def decode_genotype(model_genotype, problem_type, model_name) -> Model:
    """From a model genotype, generate the keras model"""

    model = Sequential(name=model_name)
    return_sequences = False

    for i in range(0, len(model_genotype)):

        return_sequences = False

        curr_layer = model_genotype[i]
        curr_layer_type = curr_layer[0]
        next_layer_type = model_genotype[i][0]

        if (
            next_layer_type == Layers.Recurrent
        ):  # If the next layer is LSTM return sequences is true
            return_sequences = True

        klayer = array_to_layer(curr_layer, return_sequences=return_sequences)

        if klayer != None:
            model.add(klayer)
        else:
            print("Model could not be fetched")
            return None

        if next_layer_type == Layers.FullyConnected:
            if (
                curr_layer_type == Layers.Convolutional
            ):  # If the next layer is FC and current is Conv, Flatten output
                model.add(Flatten())

    return model


def array_to_layer(
    array,
    return_sequences=False,
):
    """Map from an array to a layer"""

    klayer = None
    neurons_units = array[1]
    activation = array[2]
    filter_size = array[3]
    kernel_size = array[4]
    stride = array[5]
    pool_size = array[6]
    dropout_rate = array[7]

    if array[0] == Layers.FullyConnected:
        klayer = Dense(
            neurons_units,
            activation=activations[activation],
            kernel_initializer="glorot_normal",
        )
    elif array[0] == Layers.Recurrent:
        klayer = LSTM(
            neurons_units,
            activation=activations[activation],
            kernel_initializer="glorot_normal",
            return_sequences=return_sequences,
        )
    elif array[0] == Layers.Convolutional:
        klayer = Conv2D(
            filter_size,
            (kernel_size, kernel_size),
            strides=(stride, stride),
            padding="valid",
            activation=activations[activation],
            kernel_initializer="glorot_normal",
        )
    elif array[0] == Layers.Pooling:
        klayer = MaxPooling2D(pool_size=(pool_size, pool_size))
    elif array[0] == Layers.Dropout:
        klayer = Dropout(dropout_rate)
    else:
        print("Layer not valid")
        klayer = None

    return klayer


def get_compiled_model(
    model,
    problem_type,
    optimizer_params=[],
    metrics=None,
    prod=False,
):
    """Obtain a keras compiled model"""

    # Shared parameters for the models
    optimizer = Adam(learning_rate=0.001, beta_1=0.5)

    if problem_type == ProblemType.Regression:
        lossFunction = "mean_squared_error"
        all_metrics = ["mse"]
    elif problem_type == ProblemType.Classification:
        lossFunction = "categorical_crossentropy"
        all_metrics = [
            CategoricalAccuracy(name="accuracy"),
            Precision(name="precision"),
            Recall(name="recall"),
        ]
        if metrics:
            all_metrics.extend(metrics)
    else:
        print("Problem type not defined")
        model = None
        return

    # Create and compile the models
    model.compile(
        optimizer=optimizer,
        loss=lossFunction,
        metrics=all_metrics if not prod else [],
    )

    return model
