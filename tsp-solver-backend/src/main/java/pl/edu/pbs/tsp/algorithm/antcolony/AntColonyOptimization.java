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

    private final double alpha;
    private final double beta;
    private final double evaporationRate;
    private final double Q;
    private final double antFactor;
    private final double randomCitySelection;
    private final int iterations;
    private final int maxIterationsNoImprovement;
    private final List<Ant> ants = new ArrayList<>();
    private final double INIT_TRAIL_PHEROMONE_VALUE = 1.0;
    private int citiesNumber;
    private double[][] costMatrix;
    private double[][] pheromoneMatrix;
    private double[][] probabilityMatrix;
    private int currentCityIndex;

    private List<Integer> bestCitiesOrder;
    private double bestTotalCost;
    private int iterationsNoImprovementCounter = 0;

    public AntColonyOptimization(double alpha, double beta, double evaporationRate, double q, double antFactor,
                                 double randomCitySelection, int iterations, int maxIterationsNoImprovement) {
        this.alpha = alpha;
        this.beta = beta;
        this.evaporationRate = evaporationRate;
        this.Q = q;
        this.antFactor = antFactor;
        this.randomCitySelection = randomCitySelection;
        this.iterations = iterations;
        this.maxIterationsNoImprovement = maxIterationsNoImprovement;
    }

    @Override
    protected Route solve(double[][] costMatrix) {
        this.costMatrix = costMatrix;
        citiesNumber = costMatrix.length;
        int antsNumber = (int) (citiesNumber * antFactor);
        pheromoneMatrix = new double[citiesNumber][citiesNumber];
        bestTotalCost = Double.MAX_VALUE;

        for (int i = 0; i < antsNumber; i++) {
            ants.add(new Ant(citiesNumber));
        }

        setupTrails();
        for (int i = 0; i < iterations; i++) {
//            System.out.println("Iteration: " + i);
            probabilityMatrix = calculateProbabilityForVisitingCity(costMatrix, pheromoneMatrix);
            setupAnts();
            moveAnts();
            updateTrails();
            updateBest();
            if (iterationsNoImprovementCounter > maxIterationsNoImprovement) {
                break;
            }
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
            return selectRandomCity(ant);
        }

        double[] probabilities = getProbabilityForVisitingCity(ant);
        double r = ThreadLocalRandom.current().nextDouble();
        double cumulativeProbability = 0;
        for (int i = 0; i < citiesNumber; i++) {
            cumulativeProbability += probabilities[i];
            if (cumulativeProbability >= r) {
                return i;
            }
        }

        //Rarely happens, when there are a lot of iterations and only one city was left to visit
        //Caused by NaN
        return selectRandomCity(ant);
    }

    private Integer selectRandomCity(Ant ant) {
        ArrayList<Integer> notVisitedCities = new ArrayList<>();
        for (int i = 0; i < ant.visited.length; i++) {
            if (!ant.visited[i]) {
                notVisitedCities.add(i);
            }
        }
        return notVisitedCities.get(ThreadLocalRandom.current().nextInt(notVisitedCities.size()));
    }

    public double[] getProbabilityForVisitingCity(Ant ant) {
        double[] probabilities = new double[citiesNumber];
        int currentCity = ant.citiesOrder[currentCityIndex];
        double pheromone = 0.0;
        for (int i = 0; i < citiesNumber; i++) {
            if (!ant.isVisited(i)) {
                pheromone += probabilityMatrix[currentCity][i];
            }
        }
        for (int j = 0; j < citiesNumber; j++) {
            if (ant.isVisited(j)) {
                probabilities[j] = 0.0;
            } else {
                double numerator = probabilityMatrix[currentCity][j];
                probabilities[j] = numerator / pheromone;
            }
        }
        return probabilities;
    }

    private void updateTrails() {
        for (int i = 0; i < citiesNumber; i++) {
            for (int j = 0; j < citiesNumber; j++) {
                pheromoneMatrix[i][j] *= 1.0 - evaporationRate;
            }
        }
        for (Ant a : ants) {
            double contribution = Q / a.getTrailLength(costMatrix);
            for (int i = 0; i < citiesNumber - 1; i++) {
                pheromoneMatrix[a.citiesOrder[i]][a.citiesOrder[i + 1]] += contribution;
            }
        }
    }

    private void updateBest() {
        boolean improvement = false;
        for (Ant ant : ants) {
            double trailLength = ant.getTrailLength(costMatrix);

            if (trailLength < bestTotalCost) {
                bestTotalCost = trailLength;
                bestCitiesOrder = Arrays.stream(ant.citiesOrder.clone()).boxed().collect(Collectors.toList());
                bestCitiesOrder.add(0);
                improvement = true;
//                System.out.println("Best solution: " + bestTotalCost);
            }
        }
        if (improvement) {
            this.iterationsNoImprovementCounter = 0;
        } else {
            this.iterationsNoImprovementCounter++;
        }
    }

    private void setupTrails() {
        for (int i = 0; i < citiesNumber; i++) {
            for (int j = 0; j < citiesNumber; j++) {
                pheromoneMatrix[i][j] = INIT_TRAIL_PHEROMONE_VALUE;
            }
        }
    }

    private double[][] calculateProbabilityForVisitingCity(double[][] costMatrix, double[][] pheromoneMatrix) {
        double[][] probabilities = new double[citiesNumber][citiesNumber];
        for (int i = 0; i < citiesNumber; i++) {
            for (int j = 0; j < citiesNumber; j++) {
                probabilities[i][j] = Math.pow(pheromoneMatrix[i][j], alpha) * Math.pow(1 / costMatrix[i][j], beta);
            }
        }
        return probabilities;
    }

}
