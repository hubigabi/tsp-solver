package pl.edu.pbs.tsp.algorithm;

import pl.edu.pbs.tsp.Route;

public interface Algorithm {
    Route solve(double[][] costMatrix);
}
