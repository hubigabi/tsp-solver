package pl.edu.pbs.tsp.algorithm;

import org.junit.jupiter.api.Test;
import pl.edu.pbs.tsp.Route;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class NearestNeighbourAlgorithmTest {

    @Test
    void solve() {
        double[][] travellingCostMatrix = {
                {0, 10, 15, 20},
                {10, 0, 35, 25},
                {15, 35, 0, 30},
                {20, 25, 30, 0}
        };
        NearestNeighbourAlgorithm algorithm = new NearestNeighbourAlgorithm();
        Route route = algorithm.solve(travellingCostMatrix);

        assertEquals(80, route.getTotalCost());
        assertEquals(List.of(0, 1, 3, 2, 0), route.getCitiesOrder());
    }

}