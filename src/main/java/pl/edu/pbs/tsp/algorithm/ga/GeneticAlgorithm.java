package pl.edu.pbs.tsp.algorithm.ga;

import pl.edu.pbs.tsp.Route;
import pl.edu.pbs.tsp.algorithm.Algorithm;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

public class GeneticAlgorithm extends Algorithm {

    private int populationSize;
    private int eliteSize;
    private List<List<Integer>> population;
    private int epochs;
    private double mutationRate;
    private int tournamentSize;

    private double[][] costMatrix;
    private double minCost = Double.MAX_VALUE;
    private List<Integer> bestRoute = new ArrayList<>();

    public GeneticAlgorithm(int populationSize, int eliteSize, int epochs, double mutationRate, int tournamentSize) {
        this.populationSize = populationSize;
        this.eliteSize = eliteSize;
        this.epochs = epochs;
        this.mutationRate = mutationRate;
        this.population = new ArrayList<>(populationSize);
        this.tournamentSize = tournamentSize;
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
            List<List<Integer>> selectedPopulation = selectPopulation(individuals);
            population = getNextPopulation(selectedPopulation);
            mutate(population);
        }

        Route route = new Route();
        route.setTotalCost(minCost);
        route.setCitiesOrder(bestRoute);
        return route;
    }

    private void checkRouteCost(List<Individual> individuals) {
        individuals.stream()
                .min(Comparator.comparingDouble(Individual::getTotalCost))
                .ifPresent(individual -> {
                    if (individual.getTotalCost() < minCost) {
                        minCost = individual.getTotalCost();
                        bestRoute = individual.getCitiesOrder();
                    }
                });
    }

    private List<Individual> mapToIndividuals(List<List<Integer>> population) {
        return population.stream().map(citiesOrder -> {
                    double cost = calculateCost(citiesOrder, costMatrix);
                    return new Individual(citiesOrder, cost);
                })
                .collect(Collectors.toList());
    }

    private List<List<Integer>> selectPopulation(List<Individual> individuals) {
        List<List<Integer>> selectedPopulation = new ArrayList<>(eliteSize);
        for (int i = 0; i < eliteSize; i++) {
            List<Individual> tournament = new ArrayList<>(tournamentSize);
            for (int j = 0; j < tournamentSize; j++) {
                int randomIndex = ThreadLocalRandom.current().nextInt(0, individuals.size());
                tournament.add(individuals.get(randomIndex));
            }
            tournament.stream()
                    .min(Comparator.comparingDouble(Individual::getTotalCost))
                    .ifPresent(individual -> selectedPopulation.add(individual.getCitiesOrder()));
        }

        return selectedPopulation;
    }

    private List<List<Integer>> getNextPopulation(List<List<Integer>> selectedPopulation) {
        List<List<Integer>> nextPopulation = new ArrayList<>(populationSize);
        int selectedPopulationSize = selectedPopulation.size();
        for (int i = 0; i < populationSize; i++) {
            int parent1Index = ThreadLocalRandom.current().nextInt(0, selectedPopulationSize);
            int parent2Index = ThreadLocalRandom.current().nextInt(0, selectedPopulationSize);

            List<Integer> child = crossover(selectedPopulation.get(parent1Index), selectedPopulation.get(parent2Index));
            nextPopulation.add(child);
        }
        return nextPopulation;
    }

    private List<Integer> crossover(List<Integer> parent1, List<Integer> parent2) {
//        Ordered crossover
        int index1 = ThreadLocalRandom.current().nextInt(1, parent1.size() - 1);
        int index2 = ThreadLocalRandom.current().nextInt(1, parent1.size() - 1);

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

    private void mutate(List<List<Integer>> population) {
        for (List<Integer> route : population) {
            for (int i = 1; i < route.size() - 1; i++) {
                if (mutationRate > ThreadLocalRandom.current().nextDouble()) {
                    int j = ThreadLocalRandom.current().nextInt(1, route.size() - 1);
                    int city1 = route.get(i);
                    int city2 = route.get(j);
                    route.set(i, city2);
                    route.set(j, city1);
                }
            }
        }
    }

    private List<List<Integer>> generatePopulation(int populationSize, int citiesNumber) {
        List<List<Integer>> randomPopulation = new ArrayList<>(populationSize);
        for (int i = 0; i < populationSize; i++) {
            randomPopulation.add(generateRandomRoute(citiesNumber));
        }
        return randomPopulation;
    }

}
