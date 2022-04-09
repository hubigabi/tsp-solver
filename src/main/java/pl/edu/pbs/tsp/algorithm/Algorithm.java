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
        long timeElapsed = Duration.between(start, finish).toSeconds();
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

}
