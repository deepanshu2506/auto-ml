import random
import math
from typing import List
import numpy as np
from .ann_encoding import (
    LayerCharacteristics,
    Layers,
    ProblemType,
    ann_building_rules,
    generate_characteristic,
    generate_layer,
)
from .Individual import Individual
import copy


def generation_similar(population, max_similar, similar_threshold=0.9, logger=False):
    len_pop = len(population)
    pairs = []
    distances = {}
    max_distance = 0
    max_pair = None
    similar = 0
    generation_similar = False

    for i in range(len_pop):
        for j in range(len_pop):
            if j > i:
                pairs.append((i, j))

    for pair in pairs:
        i = pair[0]
        j = pair[1]

        distance_norm = distance_between_models(
            population[i].stringModel, population[j].stringModel
        )
        distances[pair] = distance_norm

        if distance_norm > max_distance:
            max_distance = distance_norm
            max_pair = pair

    # If max distance is zero, then all the elements in the generation are equal
    if max_distance == 0:
        generation_similar = True
    else:
        # Normalize distances and see how many are greater than threshold
        for key in distances:
            normalized_distance = distances[key] / max_distance
            distances[key] = normalized_distance

            if normalized_distance < similar_threshold and key != max_pair:
                similar = similar + 1

    if similar > max_similar:
        generation_similar = True
    return generation_similar


def binary_tournament_selection(population):

    parent_pool = []

    for index in range(len(population) // 2):

        if population[index * 2].fitness < population[index * 2 + 1].fitness:
            parent_pool.append(population[index * 2])
        else:
            parent_pool.append(population[index * 2 + 1])

    return parent_pool


def tournament_selection(subpopulation):

    if len(subpopulation) < 2:
        print("At least two individuals are required")
        return None
    else:
        most_fit = subpopulation[0]
    for index in range(1, len(subpopulation)):

        individual = subpopulation[index]
        if individual.fitness < most_fit.fitness:
            most_fit = individual

    return most_fit


def rectify_activations_by_layer_type(stringModel, layer_type, activation):
    """Given a layer type, apply the same activation function to all similar layers"""

    for i in range(len(stringModel) - 1):

        layer = stringModel[i]
        if layer[0] == layer_type:
            layer[2] = activation


def rectify_activations_offspring(stringModel):
    """Rectify the model so that all the similar layers have the same activation"""

    used_activations = {}

    for i in range(
        len(stringModel) - 1
    ):  # Last layer is disregarded as it sould not be changed

        layer = stringModel[i]

        layer_type = layer[0]
        activation = layer[2]

        if layer_type in used_activations:
            layer[2] = used_activations[layer_type]
        else:
            used_activations[layer_type] = activation

    return used_activations


def two_point_crossover(parent1, parent2, max_layers, max_attempts=5, logger=False):

    stringModel1 = parent1.stringModel
    len_model1 = (
        len(stringModel1) - 1
    )  # Len model-1 because the last layer can not be moved

    attempts = 0
    success = False

    while attempts < max_attempts:

        temp = 0
        attempts = attempts + 1
        compatible_substructures = []

        # Choose a random point to do the two point crossover
        point11 = np.random.randint(len_model1)
        point12 = np.random.randint(len_model1)
        point21 = -1
        point22 = -1

        if point11 > point12:
            temp = point11
            point11 = point12
            point12 = temp
        elif (
            point11 == point12
        ):  # Should it go all the way to the end of the string or just stay there?
            point12 = (
                len_model1 - 1
            )  # Go to the last layer (excepting the output layer)
        else:
            pass

        first_layer = True if point11 == 0 else False

        if first_layer == True:
            layer_prev = stringModel1[point11]
        else:
            layer_prev = stringModel1[point11 - 1]

        layer_next = stringModel1[point12 + 1]

        compatible_previuos, compatible_next = find_match(
            parent2, layer_prev, layer_next, first_layer, max_layers
        )

        if (
            compatible_next != [] or compatible_previuos != []
        ):  # If there are compatible layers, proceed, otherwise look for other crossover points

            # Make pairs of possible substructures
            for i in compatible_previuos:
                for j in compatible_next:

                    if j - i < max_layers and j - i >= 0:
                        compatible_substructures.append((i, j))

            if compatible_substructures != []:

                k = np.random.randint(len(compatible_substructures))
                chosen_substructure = compatible_substructures[k]
                point21 = chosen_substructure[0]
                point22 = chosen_substructure[1]
                success = True
                break

    return (point11, point12, point21, point22, success)


def find_match(parent, layer_prev, layer_next, first_layer, max_layers):
    """Try to find compatible layers according to the points chosen by the parent1"""

    stringModel = parent.stringModel
    len_model = len(stringModel)

    point11 = 0
    point12 = 0

    compatible_previuos = []
    compatible_next = []

    for i in range(len_model - 1):  # Dismiss last layer

        layer = stringModel[i]

        # Check forward compatibility
        if first_layer == True:
            if layer[0] == layer_prev[0]:
                compatible_previuos.append(i)
        else:
            compatible_layers = ann_building_rules[layer_prev[0]]

            if layer[0] in compatible_layers:
                compatible_previuos.append(i)

        # Check backward compatibility
        compatible_layers = ann_building_rules[layer[0]]

        if layer_next[0] in compatible_layers:
            compatible_next.append(i)

    return compatible_previuos, compatible_next


def population_crossover(parent_pool, max_layers=3, logger=False, num_classes=1):

    pop_size = len(parent_pool) // 2
    problem_type = parent_pool[0].problem_type
    offsprings = []
    i = 0

    for index in range(pop_size):

        parent1 = parent_pool[index * 2]
        parent2 = parent_pool[index * 2 + 1]

        point11, point12, point21, point22, success = two_point_crossover(
            parent1, parent2, max_layers
        )

        if logger == True:

            print("\nParents\n")
            print(parent1.stringModel)
            print(parent2.stringModel)
            print(
                "Points: {} {} {} {}, success: {}".format(
                    point11, point12, point21, point22, success
                )
            )

        # If a valid model was created then proceed
        if success == True:

            # Dont include layers in parent 1
            offspring_stringModel = parent1.stringModel[:point11]
            offspring_stringModel.extend(parent2.stringModel[point21 : point22 + 1])
            offspring_stringModel.extend(parent1.stringModel[point12 + 1 :])

            # Perform deep copy to avoid cross references
            offspring_stringModel = copy.deepcopy(offspring_stringModel)

            used_activations = rectify_activations_offspring(offspring_stringModel)

            if logger == True:
                print("Offspring\n")
                print(offspring_stringModel)

            offspring = Individual(
                pop_size + i,
                problem_type,
                offspring_stringModel,
                used_activations,
                num_classes,
            )
            offsprings.append(offspring)
            i = i + 1

    return offsprings


def mutation(offsprings, mutation_ratio):

    for individual in offsprings:

        mutation_probability = random.random()
        print("Mutation probability " + str(mutation_probability))
        if mutation_probability < mutation_ratio:

            # pick a layer randomly
            len_model = len(individual.stringModel)
            random_layer_index = np.random.randint(
                len_model - 1
            )  # Last layer can not be modified

            # print("\nInidividual before mutation")
            # print(individual)
            # print("\nLayer number " + str(random_layer_index))
            # print(individual.stringModel[random_layer_index])

            individual.stringModel = layer_based_mutation(
                individual.stringModel, random_layer_index
            )

            # print("\nInidividual after mutation")
            # print(individual)


def layer_based_mutation(stringModel, layer_index, logger=True):
    """For a given layer, perform a mutation that will effectively affect the layer"""

    layer = stringModel[layer_index]
    layer_next = stringModel[layer_index + 1]
    layer_type = layer[0]
    layer_type_next = layer_next[0]
    characteristic = 0
    stringModelCopy = []

    # Randomly select a characteristic from the layer that effectively affects the layer

    if layer_type == Layers.FullyConnected:
        characteristic = random.choice(
            [
                LayerCharacteristics.NeuronsNumber.value,
                LayerCharacteristics.ActivationType.value,
                LayerCharacteristics.DropoutRate.value,
            ]
        )

    elif layer_type == Layers.Convolutional:
        characteristic = random.choice(
            [
                LayerCharacteristics.ActivationType.value,
                LayerCharacteristics.FilterSizeCNN.value,
                LayerCharacteristics.KernelSizeCNN.value,
                LayerCharacteristics.StrideCNN.value,
                LayerCharacteristics.DropoutRate.value,
            ]
        )

    elif layer_type == Layers.Pooling:
        characteristic = LayerCharacteristics.PoolingSize.value

    elif layer_type == Layers.Recurrent:
        characteristic = random.choice(
            [
                LayerCharacteristics.NeuronsNumber.value,
                LayerCharacteristics.ActivationType.value,
                LayerCharacteristics.DropoutRate.value,
            ]
        )

    elif layer_type == Layers.Dropout:
        characteristic = LayerCharacteristics.DropoutRate.value

    else:
        characteristic = -1

    characteristic = LayerCharacteristics(characteristic)
    value = generate_characteristic(layer, characteristic)

    if logger == True:
        print("Choosen characteristic " + str(characteristic))
        print("Selected value " + str(value))

    # If valid layer, then generate
    if characteristic != LayerCharacteristics.DropoutRate and value != -1:
        layer[characteristic.value] = value

        if (
            characteristic == LayerCharacteristics.ActivationType
        ):  # For layer type, rectify entire model with the new activation for layer of type layer_type
            activation = value
            rectify_activations_by_layer_type(stringModel, layer_type, activation)

    elif (
        characteristic == LayerCharacteristics.DropoutRate and value != -1
    ):  # For dropout
        if layer_type != Layers.Dropout:

            if layer_type_next == Layers.Dropout:
                layer_next[LayerCharacteristics.DropoutRate.value] = value
            else:
                stringModelCopy = stringModel[: layer_index + 1]

                dropOutLayer = [Layers.Dropout, 0, 0, 0, 0, 0, 0, 0]
                dropOutLayer[LayerCharacteristics.DropoutRate.value] = value

                stringModelCopy.append(dropOutLayer)
                stringModelCopy.extend(stringModel[layer_index + 1 :])

                stringModel = copy.deepcopy(stringModelCopy)
        else:
            layer[LayerCharacteristics.DropoutRate.value] = value

    return stringModel


def generate_model(
    model=None,
    prev_component=Layers.Empty,
    next_component=Layers.Empty,
    max_layers=64,
    more_layers_prob=0.7,
    used_activations={},
):
    """Iteratively and randomly generate a model"""

    layer_count = 0
    success = False

    if model == None:
        model = list()

    while True:

        curr_component = random.choice(ann_building_rules[prev_component])

        # Perturbate param layer
        if curr_component == Layers.PerturbateParam:
            ann_building_rules[Layers.PerturbateParam] = ann_building_rules[
                prev_component
            ]
        elif curr_component == Layers.Dropout:  # Dropout layer
            ann_building_rules[Layers.Dropout] = ann_building_rules[
                prev_component
            ].copy()
            ann_building_rules[Layers.Dropout].remove(Layers.Dropout)

        rndm = random.random()
        rndm = 1 - math.sqrt(
            1 - rndm
        )  # Inverse transformation of -2x + 2 which is the probability distribution we want to follow.
        more_layers = rndm <= more_layers_prob

        # Keep adding more layers
        if more_layers == False:
            # Is this layer good for ending?
            if (
                next_component == Layers.Empty
                or next_component in ann_building_rules[curr_component]
            ):
                layer = generate_layer(curr_component, used_activations)
                model.append(layer)
                prev_component = curr_component
                success = True
                break

            # Keep looking for layer	if max_layers not reached
            elif max_layers >= layer_count:
                continue
            else:
                success = False
                model = []
                break
        else:
            layer = generate_layer(curr_component, used_activations)
            model.append(layer)
            prev_component = curr_component

    return model, success


def initial_population(
    pop_size, problem_type, architecture_type, number_classes=2, more_layers_prob=0.7
) -> List[Individual]:

    population = []

    for i in range(pop_size):

        used_activations = {}

        model_genotype, success = generate_model(
            more_layers_prob=more_layers_prob,
            prev_component=architecture_type,
            used_activations=used_activations,
        )

        # Generate first layer
        layer_first = generate_layer(architecture_type, used_activations)

        # Last layer is always FC
        if problem_type == ProblemType.Regression:
            layer_last = [Layers.FullyConnected, 1, 4, 0, 0, 0, 0, 0]
        else:
            layer_last = [Layers.FullyConnected, number_classes, 3, 0, 0, 0, 0, 0]

        model_genotype.append(layer_last)
        model_genotype = [layer_first] + model_genotype

        individual = Individual(
            i, problem_type, model_genotype, used_activations, number_classes
        )
        population.append(individual)
    return population


def distance_between_models(stringModel1, stringModel2):
    """Compute the similarity between two given models"""

    len_model1 = len(stringModel1)
    len_model2 = len(stringModel2)

    len_layer = len(stringModel1[0])

    layer_distance = np.zeros(len_layer)

    distance = 0

    if len_model1 > len_model2:

        for i in range(len_model2 - 1):
            layer_distance[0] = stringModel1[i][0].value - stringModel2[i][0].value

            for j in range(1, len_layer):
                layer_distance[j] = stringModel1[i][j] - stringModel2[i][j]

            distance += np.linalg.norm(layer_distance, 2)

        for i in range(len_model2 - 1, len_model1 - 1):
            layer_distance[0] = stringModel1[i][0].value

            for j in range(1, len_layer):
                layer_distance[j] = stringModel1[i][j]

            distance += np.linalg.norm(layer_distance, 2)

    else:

        for i in range(len_model1 - 1):
            layer_distance[0] = stringModel2[i][0].value - stringModel1[i][0].value

            for j in range(1, len_layer):
                layer_distance[j] = stringModel2[i][j] - stringModel1[i][j]

            distance += np.linalg.norm(layer_distance, 2)

        for i in range(len_model1 - 1, len_model2 - 1):
            layer_distance[0] = stringModel2[i][0].value

            for j in range(1, len_layer):
                layer_distance[j] = stringModel2[i][j]

            distance += np.linalg.norm(layer_distance, 2)

    return distance
