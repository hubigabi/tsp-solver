package pl.edu.pbs.tsp.algorithm;

import pl.edu.pbs.tsp.Route;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class SimulatedAnnealing extends Algorithm {

    private double temperature;
    private final double maxTemperature;
    private final double minTemperature;
    private final double coolingRate;
    private final int iterations;
    private final int maxIterationsNoImprovement;

    private double[][] costMatrix;
    private double minCost = Double.MAX_VALUE;
    private List<Integer> bestRoute = new ArrayList<>();
    private int iterationsNoImprovementCounter = 0;

    public SimulatedAnnealing(double maxTemperature, double minTemperature, double coolingRate,
                              int iterations, int maxIterationsNoImprovement) {
        this.temperature = maxTemperature;
        this.maxTemperature = maxTemperature;
        this.minTemperature = minTemperature;
        this.coolingRate = coolingRate;
        this.iterations = iterations;
        this.maxIterationsNoImprovement = maxIterationsNoImprovement;
    }

    @Override
    protected Route solve(double[][] costMatrix) {
        this.costMatrix = costMatrix;
        boolean isMatrixSymmetric = isMatrixSymmetric(costMatrix);
        bestRoute = generateRandomRoute(costMatrix.length);
        minCost = calculateCost(bestRoute, costMatrix);

        while (temperature > minTemperature) {
            for (int i = 0; i < iterations; i++) {
                List<Integer> route = new ArrayList<>(bestRoute);
                adjustRoute(route, isMatrixSymmetric);
                checkRoute(route);
            }
            temperature *= coolingRate;
            if (iterationsNoImprovementCounter >= maxIterationsNoImprovement) {
                break;
            }
        }

        Route route = new Route();
        route.setTotalCost(minCost);
        route.setCitiesOrder(bestRoute);
        return route;
    }

    private void adjustRoute(List<Integer> route, boolean isMatrixSymmetric) {
        int index1 = ThreadLocalRandom.current().nextInt(1, route.size() - 1);
        int index2 = ThreadLocalRandom.current().nextInt(1, route.size() - 1);
        if (isMatrixSymmetric) {
            // Reversing route from two random cities
            Collections.reverse(route.subList(Math.min(index1, index2), Math.max(index1, index2) + 1));
        } else {
            // Swapping two random cities
            int city1 = route.get(index1);
            int city2 = route.get(index2);
            route.set(index1, city2);
            route.set(index2, city1);
        }
    }

    private void checkRoute(List<Integer> route) {
        double currentCost = calculateCost(route, costMatrix);
        if (currentCost <= minCost || Math.exp((minCost - currentCost) / temperature) >= ThreadLocalRandom.current().nextDouble()) {
            minCost = currentCost;
            bestRoute = route;
            this.iterationsNoImprovementCounter = 0;
        } else {
            this.iterationsNoImprovementCounter++;
        }
    }

}
