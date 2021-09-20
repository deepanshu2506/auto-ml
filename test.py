from lib.model_selection.run_experiment import run_experiment
from lib.model_selection.Configuration import Configuration
from pandas.core.frame import DataFrame
from lib.model_selection.fetch_to_keras import (
    create_tunable_model,
)
from lib.model_selection.ann_encoding import Layers, ProblemType
import pandas as pd
from sklearn.model_selection import KFold
from tensorflow import keras
import tensorflow as tf

print(tf.__version__)

dataset = pd.read_csv("C:\\Users\\deepa\\Desktop\\train.csv")
Y = dataset["price_range"]
X: DataFrame = dataset.loc[:, dataset.columns != "price_range"]
for column in X.columns:
    X[column] = (X[column] - X[column].min()) / (X[column].max() - X[column].min())
input_shape = X.shape[1:]
output_shape = len(list(Y.value_counts()))  # applies only if classification
architecture_type = Layers.FullyConnected
problem_type = ProblemType.Classification
size_scaler = 0.1

config = Configuration(
    architecture_type,
    problem_type,
    input_shape,
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
)
num_experiments = 5

Y = pd.get_dummies(Y)
X = X.values
Y = Y.values

exp_results = []

METRICS = []

for i in range(0, num_experiments):
    print(f"Experiment {i+1}")
    best = run_experiment(X, Y, configuration=config, experiment_number=i)

    kf = KFold(n_splits=5, random_state=None, shuffle=False)

    scores = []

    for train_index, test_index in kf.split(X):
        best_model = create_tunable_model(
            best.stringModel,
            config.problem_type,
            config.input_shape,
            1,
            metrics=METRICS,
        )
        X_train, X_test = X[train_index], X[test_index]
        y_train, y_test = Y[train_index], Y[test_index]
        history = best_model.fit(X_train, y_train, epochs=20)
        score = best_model.evaluate(X_test, y_test)

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
