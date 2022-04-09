package pl.edu.pbs.tsp.algorithm;

import pl.edu.pbs.tsp.Route;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class SimulatedAnnealing implements Algorithm {

    private double temperature;
    private final double maxTemperature;
    private final double minTemperature;
    private final double coolingRate;
    private final int epochsNumber;

    private double[][] costMatrix;
    private double minCost = Double.MAX_VALUE;
    private List<Integer> bestRoute = new ArrayList<>();

    public SimulatedAnnealing(double maxTemperature, double minTemperature, double coolingRate, int epochsNumber) {
        this.temperature = maxTemperature;
        this.maxTemperature = maxTemperature;
        this.minTemperature = minTemperature;
        this.coolingRate = coolingRate;
        this.epochsNumber = epochsNumber;
    }

    @Override
    public Route solve(double[][] costMatrix) {
        Instant start = Instant.now();
        this.costMatrix = costMatrix;
        bestRoute = generateRandomRoute(costMatrix.length);
        minCost = calculateCost(bestRoute);

        while (temperature > minTemperature) {
            for (int i = 0; i < epochsNumber; i++) {
                List<Integer> route = new ArrayList<>(bestRoute);
                adjustRoute(route);
                checkRoute(route);
            }
            temperature *= coolingRate;
        }

        Instant finish = Instant.now();
        long timeElapsed = Duration.between(start, finish).toSeconds();

        return new Route(timeElapsed, minCost, bestRoute);
    }

    private void adjustRoute(List<Integer> route) {
        // Reversing route from two random cities
        int index1 = ThreadLocalRandom.current().nextInt(1, route.size() - 1);
        int index2 = ThreadLocalRandom.current().nextInt(1, route.size() - 1);
        Collections.reverse(route.subList(Math.min(index1, index2), Math.max(index1, index2) + 1));

//        Only swapping two random cities
//        int city1 = route.get(index1);
//        int city2 = route.get(index2);
//        route.set(index1, city2);
//        route.set(index2, city1);
    }

    private void checkRoute(List<Integer> route) {
        double currentCost = calculateCost(route);
        if (currentCost <= minCost || Math.exp((minCost - currentCost) / temperature) >= ThreadLocalRandom.current().nextDouble()) {
            minCost = currentCost;
            bestRoute = route;
        }
    }

    private double calculateCost(List<Integer> route) {
        double cost = 0;
        for (int i = 0; i < route.size() - 1; i++) {
            cost += costMatrix[route.get(i)][route.get(i + 1)];
        }
        return cost;
    }

    private List<Integer> generateRandomRoute(int n) {
        List<Integer> route = IntStream.range(1, n).boxed().collect(Collectors.toList());
        Collections.shuffle(route);
        route.add(0, 0);
        route.add(0);
        return route;
    }

}
