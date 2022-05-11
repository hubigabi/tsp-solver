package pl.edu.pbs.tsp.algorithm;

import pl.edu.pbs.tsp.Route;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class NaiveApproach extends Algorithm {

    private double[][] costMatrix;
    private double minCost = Double.MAX_VALUE;
    private List<Integer> bestRoute = new ArrayList<>();

    @Override
    protected Route solve(double[][] costMatrix) {
        this.costMatrix = costMatrix;
        minCost = Double.MAX_VALUE;
        bestRoute = new ArrayList<>();

        int[] cities = IntStream.range(1, costMatrix.length).toArray();
        permutation(cities, cities.length);

        Route route = new Route();
        route.setTotalCost(minCost);
        route.setCitiesOrder(bestRoute);
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

        if (costPermutation < minCost) {
            minCost = costPermutation;
            bestRoute = Arrays.stream(cites).boxed().collect(Collectors.toList());
            bestRoute.add(0, 0);
            bestRoute.add(0);
        }
    }

}
