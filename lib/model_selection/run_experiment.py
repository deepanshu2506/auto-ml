from lib.model_selection.ann_encoding import ProblemType
from lib.model_selection.fetch_to_keras import population_to_keras
from lib.model_selection.Individual import Individual
from typing import List, Tuple
from pandas.core.frame import DataFrame
from lib.model_selection.Configuration import Configuration
import lib.model_selection.nn_evolutionary as nn_evolutionary
import random
import numpy as np


def evaluate_population(
    X: DataFrame,
    Y: DataFrame,
    population: List[Individual],
    configuration: Configuration,
    generation_count: int = 0,
) -> Tuple[Individual, Individual, int]:
    best_model = nn_evolutionary.Individual(
        configuration.pop_size * 2, configuration.problem_type, [], [], fitness=10 ** 8
    )  # Big score for the first comparisson
    worst_model = nn_evolutionary.Individual(
        configuration.pop_size * 2 + 1, configuration.problem_type, [], [], fitness=0
    )  # Small score for the first comparisson
    count = 0
    worst_index = 0
    pop_size = len(population)
    raw_scores = np.zeros((pop_size))
    normalized_scores = None
    population_to_keras(population, input_shape=configuration.input_shape)

    configuration.logger.info(f"Evaluating models for generation {generation_count}")
    for i, ind in enumerate(population):
        ind.compute_raw_scores(X, Y, configuration.epochs, configuration.cross_val)
        raw_scores[i] = ind.raw_score

        normalization_factor = np.linalg.norm(raw_scores)
        normalized_scores = raw_scores / normalization_factor
    for i, ind in enumerate(population):
        if ind.problem_type == ProblemType.Classification:
            ind.normalized_score = raw_scores[i]
        else:  # For regression we used normalized RMSE
            ind.normalized_score = normalized_scores[i]
        ind.compute_fitness(configuration.size_scaler)
    if ind.fitness < best_model.fitness:
        best_model = ind

    # Replace worst with previous best
    if ind.fitness > worst_model.fitness:
        worst_model = ind
        worst_index = count
    return best_model, worst_model, worst_index


def print_pop(parent_pool, logger=False):

    for ind in parent_pool:
        if logger == False:
            print(ind)


def run_experiment(
    X,
    Y,
    configuration: Configuration,
    experiment_number,
):
    """Run one experiment. An experiment consists of running the evolutionary algorithm for n generations"""
    configuration.logger.info(f"starting experiment no - {experiment_number}")
    launch_new_generation = True  # First generation is always launched
    experiment_best = None
    generation_count = 0

    elite_archive = []  # Archive to store the best individuals in each generation

    # Log the information of this experiment
    configuration.logger.info(
        "Starting model optimization: Problem type {}, Architecture type {}".format(
            configuration.problem_type, configuration.architecture_type
        )
    )
    # print("Parameters:")
    # print(
    #     "Input shape: {}, Output shape: {}, cross_val ratio: {}, Generations: {}, Population size: {}, Tournament size: {}, Binary selection: {}, Mutation ratio: {}, Size scaler: {}".format(
    #         configuration.input_shape,
    #         configuration.output_shape,
    #         configuration.cross_val,
    #         configuration.max_generations,
    #         configuration.pop_size,
    #         configuration.tournament_size,
    #         configuration.binary_selection,
    #         configuration.mutation_ratio,
    #         configuration.size_scaler,
    #     )
    # )
    configuration.logger.info("Generating initial population")
    population = nn_evolutionary.initial_population(
        configuration.pop_size,
        configuration.problem_type,
        configuration.architecture_type,
        number_classes=configuration.output_shape,
        more_layers_prob=configuration.more_layers_prob,
    )

    while (
        launch_new_generation == True
        and generation_count < configuration.max_generations
    ):

        count = 0
        worst_index = 0
        parent_pool = []
        offsprings = []

        indices = list(range(configuration.pop_size))

        print("\n\nGeneration " + str(generation_count + 1))

        # Fill checksum vector
        for ind in population:
            ind.compute_checksum_vector()

        # If the individuals in the generation are very similar prematurely stop the experiment (Here it is important to address the fact on how to measure similarity)
        generation_similar = nn_evolutionary.generation_similar(
            population,
            configuration.max_similar,
            configuration.similarity_threshold,
            logger=True,
        )
        launch_new_generation = not generation_similar

        # print("launch new")
        # print(launch_new_generation)
        # print("gen similar")
        # print(generation_similar)

        # Assess the fitness of the inidividuals in the population
        best_model, worst_model, worst_index = evaluate_population(
            X, Y, population, configuration, generation_count=generation_count + 1
        )

        if generation_count > 0:  # At least one generation so to have one best model

            previous_best = elite_archive[-1]
            if previous_best.fitness < worst_model.fitness:
                population[worst_index] = previous_best
                # print("\nWorst individual replaced")
                # print("Poulation after replacing worst with best")
                # print_pop(population, logger=True)

        elite_archive.append(best_model)

        # Save global best
        if experiment_best == None:
            experiment_best = best_model
        else:
            if best_model.fitness < experiment_best.fitness:
                experiment_best = best_model

        # Proceed with rest of algorithm
        # offsprings_complete = False
        # print("\nGenerating offsprings")
        # print("\n\nCrossover\n\n")

        # select 2*(n-1) individuals for crossover, elitism implemented
        offspring_pop_size = 0
        while configuration.pop_size - offspring_pop_size > 0:

            count = 0
            parents_pool_required = 2 * (configuration.pop_size - offspring_pop_size)

            print(
                "\nGetting offpsrings with selection: " + "binary tournament"
                if configuration.binary_selection == True
                else "tournament"
            )

            while count < parents_pool_required:

                if configuration.binary_selection == True:
                    random.shuffle(indices)
                    indices_tournament = indices[: configuration.tournament_size]

                    # print(indices)
                    # print(indices_tournament)

                    subpopulation = [population[index] for index in indices_tournament]
                    selected_individuals = nn_evolutionary.binary_tournament_selection(
                        subpopulation
                    )
                    parent_pool.extend(selected_individuals)
                    count = len(parent_pool)
                else:
                    ind_indices = random.sample(indices, 2)
                    subpopulation = [population[index] for index in ind_indices]
                    selected_individuals = nn_evolutionary.tournament_selection(
                        subpopulation
                    )
                    parent_pool.append(selected_individuals)
                    count = len(parent_pool)

            # print("\nParent pool. Parent number {}\n".format(len(parent_pool)))
            # print_pop(parent_pool, logger=False)

            offsprings = nn_evolutionary.population_crossover(parent_pool, logger=False)
            offspring_pop_size = len(offsprings)

        print("Applying Mutation")

        nn_evolutionary.mutation(offsprings, configuration.mutation_ratio)

        population = []

        population = offsprings
        offsprings = []

        generation_count = generation_count + 1

        print("Launch new generation?: " + str(launch_new_generation))
    print("Experiment {} finished".format(experiment_number))
    return experiment_best
