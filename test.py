from lib.Preprocessor import (
    df_to_dataset,
    get_category_encoding_layer,
    get_normalization_layer,
)
from lib.Logger.Logger import Logger
from lib.model_selection.run_experiment import run_experiment
from lib.model_selection.Configuration import Configuration
from lib.model_selection.fetch_to_keras import (
    create_tunable_model,
)
from lib.model_selection.ann_encoding import Layers, ProblemType
import pandas as pd
from sklearn.model_selection import KFold
import tensorflow as tf


dataset = pd.read_csv("C:\\Users\\deepa\\Desktop\\train.csv")
Y = dataset["price_range"]
# for column in X.columns:
#     X[column] = (X[column] - X[column].min()) / (X[column].max() - X[column].min())
output_shape = len(list(Y.value_counts()))  # applies only if classification
architecture_type = Layers.FullyConnected
problem_type = ProblemType.Classification
size_scaler = 0.1

all_inputs = []
encoded_features = []
for header in [
    "battery_power",
    "clock_speed",
    "int_memory",
    "m_dep",
    "mobile_wt",
    "pc",
    "px_height",
    "px_width",
    "ram",
    "sc_h",
    "sc_w",
    "talk_time",
]:
    numeric_col = tf.keras.Input(shape=(1,), name=header)
    normalization_layer = get_normalization_layer(header, dataset)
    encoded_numeric_col = normalization_layer(numeric_col)
    all_inputs.append(numeric_col)
    encoded_features.append(encoded_numeric_col)
for header in [
    "blue",
    "dual_sim",
    "three_g",
    "four_g",
    "fc",
    "n_cores",
    "touch_screen",
    "wifi",
]:
    col = tf.keras.Input(shape=(1,), name=header, dtype="int64")
    encoding_layer = get_category_encoding_layer(
        header, dataset, dtype="int64", max_tokens=5
    )
    encoded_age_col = encoding_layer(col)
    all_inputs.append(col)
    encoded_features.append(encoded_age_col)

all_features = tf.keras.layers.concatenate(encoded_features)


config = Configuration(
    architecture_type,
    problem_type,
    output_shape,
    pop_size=5,
    tournament_size=3,
    max_similar=3,
    epochs=5,
    cross_val=0.2,
    size_scaler=size_scaler,
    max_generations=10,
    binary_selection=True,
    mutation_ratio=0.8,
    similarity_threshold=0.2,
    more_layers_prob=0.8,
    verbose_individuals=True,
    show_model=True,
    verbose_training=1,
    logger=Logger(),
)
num_experiments = 5


exp_results = []

METRICS = []

for i in range(0, num_experiments):
    print(f"Experiment {i+1}")
    best = run_experiment(
        dataset,
        "price_range",
        configuration=config,
        experiment_number=i,
        input_layer=all_inputs,
        preprocessoring_layer=all_features,
    )

    kf = KFold(n_splits=5, random_state=None, shuffle=False)

    scores = []

    for train_index, test_index in kf.split(dataset):
        best_model = create_tunable_model(
            best.stringModel,
            config.problem_type,
            1,
            metrics=METRICS,
            input_layer=all_inputs,
            preprocessing_layer=all_features,
        )
        train, test = dataset.iloc[train_index], dataset.iloc[test_index]
        train_ds = df_to_dataset(train, target_variable="price_range")
        test_ds = df_to_dataset(test, target_variable="price_range")
        history = best_model.fit(train_ds, epochs=20)
        score = best_model.evaluate(test_ds)

        scores.append(score)

    scores_df = pd.DataFrame(
        data=scores, columns=["loss", "accuracy", "precision", "recall"]
    )
    scores_df["accuracy"] = scores_df["accuracy"] * 100
    scores_df["precision"] = scores_df["precision"] * 100
    scores_df["recall"] = scores_df["recall"] * 100
    print("------------------------------------------------------------------------")
    print("Score per fold")
    for i, row in scores_df.iterrows():
        print(
            "------------------------------------------------------------------------"
        )
        print(
            f"> Fold {i+1} - Loss: {row['loss']} - Accuracy: {row['accuracy']}% - precision: {row['precision']}% recall: {row['recall']}%"
        )
    print("------------------------------------------------------------------------")
    print("Average scores for all folds:")
    print(
        f"> Accuracy: {scores_df['accuracy'].mean()} (+- {scores_df['accuracy'].std()})"
    )
    print(f"> Loss: {scores_df['loss'].mean()}")
    exp_results.append(
        (
            scores_df["accuracy"].mean(),
            scores_df["accuracy"].std(),
            scores_df["precision"].mean(),
            scores_df["recall"].mean(),
            best,
        )
    )
    print("------------------------------------------------------------------------")


for i, exp in enumerate(exp_results):
    print(
        f"experiment {i+1} - > Accuracy: {exp[0]} (+- {exp[1]}) precision: {exp[2]} recall{exp[3]} params: {exp[-1].raw_size}"
    )

print("------------------------------------------------------------------------")
