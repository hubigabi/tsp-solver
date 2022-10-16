package pl.edu.pbs.tsp.algorithm.ga;

import pl.edu.pbs.tsp.Route;
import pl.edu.pbs.tsp.algorithm.Algorithm;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

public class GeneticAlgorithm extends Algorithm {

    private final int populationSize;
    private List<List<Integer>> population;
    private final int epochs;
    private final int maxEpochsNoImprovement;

    /**
     * number of the best individuals from the current generation to carry over to the next
     */
    private final int elitismSize;
    private final double mutationRate;
    private final SelectionType selectionType;
    private final int tournamentSize;
    private final CrossoverType crossoverType;
    private double[][] costMatrix;
    private double minCost = Double.MAX_VALUE;
    private List<Integer> bestRoute = new ArrayList<>();
    private int epochsNoImprovementCounter = 0;

    public GeneticAlgorithm(int populationSize, int elitismSize, int epochs, int maxEpochsNoImprovement, double mutationRate,
                            SelectionType selectionType, int tournamentSize, CrossoverType crossoverType) {
        this.populationSize = populationSize;
        this.elitismSize = elitismSize;
        this.epochs = epochs;
        this.maxEpochsNoImprovement = maxEpochsNoImprovement;
        this.mutationRate = mutationRate;
        this.selectionType = selectionType;
        this.tournamentSize = tournamentSize;
        this.crossoverType = crossoverType;
        this.population = new ArrayList<>(populationSize);
    }

    @Override
    protected Route solve(double[][] costMatrix) {
        this.costMatrix = costMatrix;
        this.minCost = Double.MAX_VALUE;
        this.bestRoute = new ArrayList<>();
        population = generatePopulation(populationSize, costMatrix.length);

        for (int i = 0; i < epochs; i++) {
            List<Individual> individuals = mapToIndividuals(population);
            checkRouteCost(individuals);
            List<Individual> elitism = elitism(individuals, elitismSize);
            population = getNextPopulation(individuals, elitism);
            mutate(population);
            if (epochsNoImprovementCounter > maxEpochsNoImprovement) {
                break;
            }
//            System.out.println("Epoch: " + i + " minCost: " + minCost);
        }

        Route route = new Route();
        route.setTotalCost(minCost);
        route.setCitiesOrder(bestRoute);
        return route;
    }

    private List<Individual> elitism(List<Individual> individuals, int elitismSize) {
        return individuals.stream()
                .sorted(Comparator.comparingDouble(Individual::getTotalCost))
                .limit(elitismSize)
                .collect(Collectors.toList());
    }

    private void checkRouteCost(List<Individual> individuals) {
        individuals.stream()
                .min(Comparator.comparingDouble(Individual::getTotalCost))
                .ifPresent(individual -> {
                    if (individual.getTotalCost() < minCost) {
                        minCost = individual.getTotalCost();
                        bestRoute = individual.getCitiesOrder();
                        this.epochsNoImprovementCounter = 0;
                    } else {
                        this.epochsNoImprovementCounter++;
                    }
                });
    }

    private List<Individual> mapToIndividuals(List<List<Integer>> population) {
        return population.stream().map(citiesOrder -> {
                    double cost = calculateCost(citiesOrder, costMatrix);
                    return new Individual(citiesOrder, cost, 1 / cost);
                })
                .collect(Collectors.toList());
    }

    private List<Integer> select(List<Individual> individuals) {
        if (selectionType == SelectionType.ROULETTE) {
            return selectByRoulette(individuals);
        } else if (selectionType == SelectionType.TOURNAMENT) {
            return selectByTournament(individuals);
        }

        throw new UnsupportedOperationException("Selection type not supported");
    }

    private List<Integer> selectByRoulette(List<Individual> individuals) {
        double totalFitness = individuals.stream().mapToDouble(Individual::getFitness).sum();
        double p = ThreadLocalRandom.current().nextDouble(totalFitness);
        double cumulativeProbability = 0.0;
        for (Individual individual : individuals) {
            cumulativeProbability += individual.getFitness();
            if (p <= cumulativeProbability) {
                return individual.citiesOrder;
            }
        }
        throw new IllegalStateException();
    }

    private List<Integer> selectByTournament(List<Individual> individuals) {
        List<Individual> tournament = new ArrayList<>(tournamentSize);
        for (int j = 0; j < tournamentSize; j++) {
            int randomIndex = ThreadLocalRandom.current().nextInt(0, individuals.size());
            tournament.add(individuals.get(randomIndex));
        }

        return tournament.stream()
                .min(Comparator.comparingDouble(Individual::getTotalCost))
                .orElseThrow().getCitiesOrder();
    }

    private List<List<Integer>> getNextPopulation(List<Individual> individuals, List<Individual> elitism) {
        List<List<Integer>> nextPopulation = new ArrayList<>(populationSize);
        nextPopulation.addAll(elitism.stream().map(Individual::getCitiesOrder).collect(Collectors.toList()));
        for (int i = 0; i < populationSize - elitism.size(); i++) {
            List<Integer> parent1 = select(individuals);
            List<Integer> parent2 = select(individuals);

            List<Integer> child = crossover(parent1, parent2);
            nextPopulation.add(child);
        }
        return nextPopulation;
    }

    private List<Integer> crossover(List<Integer> parent1, List<Integer> parent2) {
        int index1 = ThreadLocalRandom.current().nextInt(1, parent1.size() - 1);
        int index2 = ThreadLocalRandom.current().nextInt(1, parent1.size() - 1);

        boolean pmxCrossover = CrossoverType.PMX.equals(this.crossoverType);
        List<Integer> child1 = pmxCrossover ? pmxCrossover(parent1, parent2, index1) : orderedCrossover(parent1, parent2, index1, index2);
        List<Integer> child2 = pmxCrossover ? pmxCrossover(parent2, parent1, index1) : orderedCrossover(parent2, parent1, index1, index2);

        return calculateCost(child1, costMatrix) < calculateCost(child2, costMatrix) ? child1 : child2;
    }

    private List<Integer> orderedCrossover(List<Integer> parent1, List<Integer> parent2, int index1, int index2) {
        int min = Math.min(index1, index2);
        int max = Math.max(index1, index2) + 1;

        List<Integer> childPart1 = parent1.subList(min, max);
        List<Integer> childPart2 = new ArrayList<>(parent2);
        for (int value : childPart1) {
            childPart2.remove(Integer.valueOf(value));
        }

        ArrayList<Integer> child = new ArrayList<>(parent1.size());
        child.addAll(childPart2.subList(0, min));
        child.addAll(childPart1);
        child.addAll(childPart2.subList(min, childPart2.size()));
        return child;
    }

    private List<Integer> pmxCrossover(List<Integer> parent1, List<Integer> parent2, int index) {
        List<Integer> childPart1 = parent1.subList(0, index);
        List<Integer> childPart2 = new ArrayList<>(parent2);
        for (int i = 0; i < childPart1.size(); i++) {
            int j = childPart2.indexOf(childPart1.get(i));
            swapCities(childPart2, i, j);
        }

        ArrayList<Integer> child = new ArrayList<>(parent1.size());
        child.addAll(childPart1);
        child.addAll(childPart2.subList(index, childPart2.size()));
        return child;
    }

    private void mutate(List<List<Integer>> population) {
        for (List<Integer> route : population) {
            for (int i = 1; i < route.size() - 1; i++) {
                if (mutationRate > ThreadLocalRandom.current().nextDouble()) {
                    int j = ThreadLocalRandom.current().nextInt(1, route.size() - 1);
//                    swapCities(route, i, j);
                    insertCityBeforeOther(route, i, j);
                }
            }
        }
    }

    //    http://www.permutationcity.co.uk/projects/mutants/tsp.html
    private void insertCityBeforeOther(List<Integer> route, int i, int j) {
        int city = route.get(j);
        route.remove(j);
        route.add(i, city);
    }

    private void swapCities(List<Integer> route, int i, int j) {
        int city1 = route.get(i);
        int city2 = route.get(j);
        route.set(i, city2);
        route.set(j, city1);
    }

    private List<List<Integer>> generatePopulation(int populationSize, int citiesNumber) {
        List<List<Integer>> randomPopulation = new ArrayList<>(populationSize);
        for (int i = 0; i < populationSize; i++) {
            randomPopulation.add(generateRandomRoute(citiesNumber));
        }
        return randomPopulation;
    }

}
