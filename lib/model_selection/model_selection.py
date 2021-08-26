from pandas.core.frame import DataFrame
from pandas.core.series import Series
from tensorflow.python.keras.models import Model
from lib.model_selection.Individual import Individual
from lib.model_selection.fetch_to_keras import create_tunable_model
from typing import List, Tuple, Union
from lib.model_selection.ann_encoding import Layers, ProblemType
from lib.model_selection.Configuration import Configuration
from lib.model_selection.run_experiment import run_experiment
from sklearn.model_selection import KFold
import pandas as pd


class ModelSelection:
    def __init__(
        self,
        problem_type: ProblemType,
        architecture_type: Layers,
        num_experiments: int = 5,
        size_scaler: float = 0.7,
        tournament_size=3,
        max_similar=3,
        epochs=5,
        cross_val=0.2,
        max_generations=10,
        more_layers_prob=0.8,
                    cv_training_epochs = 20

    ) -> None:
        self.config = Configuration(
            architecture_type,
            problem_type,
            pop_size=5,
            tournament_size=tournament_size,
            max_similar=max_similar,
            epochs=epochs,
            cross_val=cross_val,
            size_scaler=size_scaler,
            max_generations=max_generations,
            binary_selection=True,
            mutation_ratio=0.8,
            similarity_threshold=0.2,
            more_layers_prob=more_layers_prob,
            verbose_individuals=True,
            show_model=True,
            verbose_training=1,
        )
        self.num_experiments = num_experiments
        self.metrics = []
        self.training_epochs = cv_training_epochs

    def _generate_folds(self,X, Y, splits=5):
        kf = KFold(n_splits=splits, random_state=None, shuffle=False)
        for train_index, test_index in kf.split():
            X_train, X_test = X[train_index], X[test_index]
            y_train, y_test = Y[train_index], Y[test_index]
            yield X_train, X_test, y_train, y_test

    def process_scores(self,scores)->DataFrame:
        scores_df = pd.DataFrame(
                data=scores, columns=["loss", "accuracy", "precision", "recall"]
            )
        scores_df["accuracy"] = scores_df["accuracy"] * 100
        scores_df["precision"] = scores_df["precision"] * 100
        scores_df["recall"] = scores_df["recall"] * 100
        return scores_df

    def _evaluate_model(self,model:Model , X_train,y_train,X_test,y_test)->DataFrame:
        model.fit(X_train, y_train, epochs=self.training_epochs)
        metric_scores = model.evaluate(X_test, y_test)
        return metric_scores

    def fit(self, X: DataFrame, Y: Union[DataFrame, Series]) -> List[Individual]:
        self.config.input_shape = X.shape[1:]
        self.X = X
        self.Y = Y

        if self.config.problem_type == ProblemType.Classification:
            self.config.output_shape = len(list(Y.value_counts()))

        exp_results = []
        for i in range(0, self.num_experiments):
            print(f"Experiment {i+1}")
            best = run_experiment(X, Y, configuration=self.config, experiment_number=i)

            scores = []
            for  X_train, X_test, y_train, y_test in self._generate_folds(X,Y):
                best_model = create_tunable_model(
                    best.stringModel,
                    self.config.problem_type,
                    self.config.input_shape,
                    1,
                    metrics=self.metrics,
                )
                score =self._evaluate_model(best_model , X_train,y_train,X_test,y_test)
                scores.append(score)

            scores_df = self.process_scores(scores)
            self.print_scores(scores_df)
            exp_results.append(
                (
                    scores_df["accuracy"].mean(),
                    scores_df["accuracy"].std(),
                    scores_df["precision"].mean(),
                    scores_df["recall"].mean(),
                    best,
                )
            )
        self.print_exp_results(exp_results)

        self.best_models = exp_results
        return exp_results[:][-1]

    
    def print_scores(self,scores_df)->None:
        if self.config.verbose_training == 0: 
            return
        print(
                "------------------------------------------------------------------------"
            )
        print("Score per fold")
        for i, row in scores_df.iterrows():
            print(
                "------------------------------------------------------------------------"
            )
            print(
                f"> Fold {i+1} - Loss: {row['loss']} - Accuracy: {row['accuracy']}% - precision: {row['precision']}% recall: {row['recall']}%"
            )
        print(
            "------------------------------------------------------------------------"
        )
        print("Average scores for all folds:")
        print(
            f"> Accuracy: {scores_df['accuracy'].mean()} (+- {scores_df['accuracy'].std()})"
        )
        print(f"> Loss: {scores_df['loss'].mean()}")
        print(
                "------------------------------------------------------------------------"
            )

    def print_exp_results(self,exp_results):
        if self.config.verbose_training == 0: 
            return
        for i, exp in enumerate(exp_results):
            print(
                f"experiment {i+1} - > Accuracy: {exp[0]} (+- {exp[1]}) precision: {exp[2]} recall{exp[3]} params: {exp[-1].raw_size}"
            )
        print(
            "------------------------------------------------------------------------"
        )