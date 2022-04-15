package pl.edu.pbs.tsp.algorithm.antcolony;

import pl.edu.pbs.tsp.Route;
import pl.edu.pbs.tsp.algorithm.Algorithm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class AntColonyOptimization extends Algorithm {

    private double alpha = 1;
    private double beta = 5;
    private double evaporation = 0.5;
    private double Q = 500;
    private double antFactor = 0.8;
    private double randomCitySelection = 0.01;
    private int maxIterations = 100;

    private final double INIT_TRAIL_PHEROMONE_VALUE = 1.0;
    private int citiesNumber;
    private double[][] costMatrix;
    private double[][] trails;
    private List<Ant> ants = new ArrayList<>();
    private int currentCityIndex;

    private List<Integer> bestCitiesOrder;
    private double bestTotalCost;

    public AntColonyOptimization(double alpha, double beta, double evaporation, double q,
                                 double antFactor, double randomCitySelection, int maxIterations) {
        this.alpha = alpha;
        this.beta = beta;
        this.evaporation = evaporation;
        this.Q = q;
        this.antFactor = antFactor;
        this.randomCitySelection = randomCitySelection;
        this.maxIterations = maxIterations;
    }

    @Override
    protected Route solve(double[][] costMatrix) {
        this.costMatrix = costMatrix;
        citiesNumber = costMatrix.length;
        int antsNumber = (int) (citiesNumber * antFactor);
        trails = new double[citiesNumber][citiesNumber];
        bestTotalCost = Double.MAX_VALUE;

        for (int i = 0; i < antsNumber; i++) {
            ants.add(new Ant(citiesNumber));
        }

        setupTrails();
        for (int i = 0; i < maxIterations; i++) {
            System.out.println("Iteration: " + i);
            setupAnts();
            moveAnts();
            updateTrails();
            updateBest();
        }

        Route route = new Route();
        route.setCitiesOrder(bestCitiesOrder);
        route.setTotalCost(calculateCost(bestCitiesOrder, costMatrix));
        return route;
    }

    private void setupAnts() {
        ants.forEach(ant -> {
            ant.clear();
            ant.visitCity(0, 0);
        });

        currentCityIndex = 0;
    }

    private void moveAnts() {
        IntStream.range(0, citiesNumber - 1)
                .forEach(i -> {
                    ants.forEach(ant -> ant.visitCity(currentCityIndex + 1, selectNextCity(ant)));
                    currentCityIndex++;
                });
    }

    private int selectNextCity(Ant ant) {
        if (ThreadLocalRandom.current().nextDouble() < randomCitySelection) {
            ArrayList<Integer> notVisitedCities = new ArrayList<>();
            for (int i = 0; i < ant.visited.length; i++) {
                if (!ant.visited[i]) {
                    notVisitedCities.add(i);
                }
            }
            return notVisitedCities.get(ThreadLocalRandom.current().nextInt(notVisitedCities.size()));
        }

        double[] probabilities = calculateProbabilitiesForVisitingCity(ant);
        double r = ThreadLocalRandom.current().nextDouble();
        double cumulativeProbability = 0;
        for (int i = 0; i < citiesNumber; i++) {
            cumulativeProbability += probabilities[i];
            if (cumulativeProbability >= r) {
                return i;
            }
        }

        throw new IllegalStateException("There are no other cities to select");
    }

    public double[] calculateProbabilitiesForVisitingCity(Ant ant) {
        double[] probabilities = new double[citiesNumber];
        int currentCity = ant.citiesOrder[currentCityIndex];
        double pheromone = 0.0;
        for (int i = 0; i < citiesNumber; i++) {
            if (!ant.isVisited(i)) {
                pheromone += Math.pow(trails[currentCity][i], alpha) * Math.pow(1.0 / costMatrix[currentCity][i], beta);
            }
        }
        for (int j = 0; j < citiesNumber; j++) {
            if (ant.isVisited(j)) {
                probabilities[j] = 0.0;
            } else {
                double numerator = Math.pow(trails[currentCity][j], alpha) * Math.pow(1.0 / costMatrix[currentCity][j], beta);
                probabilities[j] = numerator / pheromone;
            }
        }
        return probabilities;
    }

    private void updateTrails() {
        for (int i = 0; i < citiesNumber; i++) {
            for (int j = 0; j < citiesNumber; j++) {
                trails[i][j] *= evaporation;
            }
        }
        for (Ant a : ants) {
            double contribution = Q / a.getTrailLength(costMatrix);
            for (int i = 0; i < citiesNumber - 1; i++) {
                trails[a.citiesOrder[i]][a.citiesOrder[i + 1]] += contribution;
            }
        }
    }

    private void updateBest() {
        for (Ant ant : ants) {
            double trailLength = ant.getTrailLength(costMatrix);

            if (trailLength < bestTotalCost) {
                bestTotalCost = trailLength;
                bestCitiesOrder = Arrays.stream(ant.citiesOrder.clone()).boxed().collect(Collectors.toList());
                bestCitiesOrder.add(0);
                System.out.println("Best solution: " + bestTotalCost);
            }
        }
    }

    private void setupTrails() {
        for (int i = 0; i < citiesNumber; i++) {
            for (int j = 0; j < citiesNumber; j++) {
                trails[i][j] = INIT_TRAIL_PHEROMONE_VALUE;
            }
        }
    }

}
