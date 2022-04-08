package pl.edu.pbs.tsp.algorithm;

import pl.edu.pbs.tsp.Route;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class NaiveApproach implements Algorithm {

    public double[][] costMatrix;
    public double totalCost = Double.MAX_VALUE;
    public List<Integer> citiesOrder = new ArrayList<>();

    @Override
    public Route solve(double[][] costMatrix) {
        this.costMatrix = costMatrix;
        Instant start = Instant.now();

        int[] cities = IntStream.range(1, costMatrix.length).toArray();
        permutation(cities, cities.length);

        Instant finish = Instant.now();
        long timeElapsed = Duration.between(start, finish).toSeconds();

        Route route = new Route();
        route.setTotalCost(totalCost);
        route.setCitiesOrder(citiesOrder);
        route.setCalculationTime(timeElapsed);
        return route;
    }

    private void permutation(int[] cities, int n) {
        if (n == 1) {
            checkPermutation(cities);
        } else {
            for (int i = 0; i < n - 1; i++) {
                permutation(cities, n - 1);
                if (n % 2 == 0) {
                    swap(cities, i, n - 1);
                } else {
                    swap(cities, 0, n - 1);
                }
            }
            permutation(cities, n - 1);
        }
    }

    private void swap(int[] cities, int a, int b) {
        int tmp = cities[a];
        cities[a] = cities[b];
        cities[b] = tmp;
    }

    private void checkPermutation(int[] cites) {
        double costPermutation = costMatrix[0][cites[0]];

        for (int i = 0; i < cites.length - 1; i++) {
            costPermutation += costMatrix[cites[i]][cites[i + 1]];
        }
        costPermutation += costMatrix[cites[cites.length - 1]][0];

        if (costPermutation < totalCost) {
            totalCost = costPermutation;
            citiesOrder = Arrays.stream(cites).boxed().collect(Collectors.toList());
            citiesOrder.add(0, 0);
            citiesOrder.add(0);
        }
    }

}
