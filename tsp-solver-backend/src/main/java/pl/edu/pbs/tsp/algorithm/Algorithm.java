package pl.edu.pbs.tsp.algorithm;

import pl.edu.pbs.tsp.Route;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public abstract class Algorithm {

    protected abstract Route solve(double[][] costMatrix);

    public Route getRoute(double[][] costMatrix) {
        Instant start = Instant.now();
        Route route = solve(costMatrix);
        Instant finish = Instant.now();
        double timeElapsed = Duration.between(start, finish).toMillis() / 1000.0;
        route.setCalculationTime(timeElapsed);
        return route;
    }

    protected List<Integer> generateRandomRoute(int n) {
        List<Integer> route = IntStream.range(1, n).boxed().collect(Collectors.toList());
        Collections.shuffle(route);
        route.add(0, 0);
        route.add(0);
        return route;
    }

    protected void validateRoute(List<Integer> route) {
        List<Integer> sequentialNumbers = IntStream.range(1, route.size() - 1).boxed().collect(Collectors.toList());
        if (route.get(0) != 0 || route.get(route.size() - 1) != 0 || !route.containsAll(sequentialNumbers)) {
            throw new RuntimeException("Route is not valid");
        }
    }

    protected double calculateCost(List<Integer> route, double[][] costMatrix) {
        double cost = 0;
        for (int i = 0; i < route.size() - 1; i++) {
            cost += costMatrix[route.get(i)][route.get(i + 1)];
        }
        return cost;
    }

    protected boolean isMatrixSymmetric(double[][] costMatrix) {
        for (int i = 0; i < costMatrix.length; i++) {
            for (int j = 0; j < costMatrix.length; j++) {
                if (costMatrix[i][j] != costMatrix[j][i]) {
                    return false;
                }
            }
        }
        return true;
    }

}
