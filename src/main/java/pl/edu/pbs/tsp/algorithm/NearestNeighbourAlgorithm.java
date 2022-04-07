package pl.edu.pbs.tsp.algorithm;

import pl.edu.pbs.tsp.Route;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;;

public class NearestNeighbourAlgorithm implements Algorithm {

    @Override
    public Route solve(double[][] costMatrix) {
        Instant start = Instant.now();

        double totalCost = 0;
        int lastVisitedCity = 0;
        List<Integer> citiesVisited = new ArrayList<>();
        citiesVisited.add(lastVisitedCity);

        for (int i = 1; i < costMatrix.length; i++) {
            double[] row = costMatrix[lastVisitedCity];

            int indexOfMinCostForUnvisitedCities = indexOfMinCostForUnvisitedCities(row, citiesVisited);
            lastVisitedCity = indexOfMinCostForUnvisitedCities;
            citiesVisited.add(indexOfMinCostForUnvisitedCities);
            totalCost += row[indexOfMinCostForUnvisitedCities];
        }

        // Adding road from last city to first city
        double[] lastCityRow = costMatrix[lastVisitedCity];
        citiesVisited.add(0);
        totalCost += lastCityRow[0];

        Instant finish = Instant.now();
        long timeElapsed = Duration.between(start, finish).toMillis();

        Route route = new Route();
        route.setTotalDistance(totalCost);
        route.setCitiesOrder(citiesVisited);
        route.setCalculationTime(timeElapsed);
        return route;
    }

    public static int indexOfMinCostForUnvisitedCities(double[] array, List<Integer> citiesVisited) {
        if (array.length == 0) {
            return -1;
        }

        int index = -1;
        double min = Double.MAX_VALUE;

        for (int i = 0; i < array.length; i++) {
            if (array[i] < min && !citiesVisited.contains(i)) {
                min = array[i];
                index = i;
            }
        }
        return index;
    }


}
