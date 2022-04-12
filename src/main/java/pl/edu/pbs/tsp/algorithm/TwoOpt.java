package pl.edu.pbs.tsp.algorithm;

import lombok.NoArgsConstructor;
import pl.edu.pbs.tsp.Route;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@NoArgsConstructor
public class TwoOpt extends Algorithm {

    private List<Integer> bestRoute = new ArrayList<>();

    public TwoOpt(List<Integer> bestRoute) {
        this.bestRoute = bestRoute;
    }

    @Override
    protected Route solve(double[][] costMatrix) {
        if (bestRoute == null || bestRoute.size() != costMatrix.length + 1) {
            bestRoute = generateRandomRoute(costMatrix.length);
        }
        double minCost = calculateCost(bestRoute, costMatrix);

        double newMinCost = minCost;
        List<Integer> newBestRoute = new ArrayList<>(bestRoute);
        do {
            minCost = newMinCost;
            bestRoute = new ArrayList<>(newBestRoute);
            for (int i = 1; i < costMatrix.length - 1; i++) {
                for (int j = i + 1; j < costMatrix.length; j++) {
                    List<Integer> newRoute = twoOptSwap(bestRoute, i, j);
                    double newCost = calculateCost(newRoute, costMatrix);
                    if (newCost < newMinCost) {
                        newBestRoute = new ArrayList<>(newRoute);
                        newMinCost = newCost;
                    }
                }
            }
        } while (newMinCost < minCost);

        Route route = new Route();
        route.setTotalCost(minCost);
        route.setCitiesOrder(bestRoute);
        return route;
    }

    private List<Integer> twoOptSwap(List<Integer> route, int i, int j) {
        List<Integer> newRoute = new ArrayList<>(route.subList(0, i));
        List<Integer> reversedSubList = new ArrayList<>(route.subList(i, j + 1));
        Collections.reverse(reversedSubList);
        newRoute.addAll(reversedSubList);
        newRoute.addAll(route.subList(j + 1, route.size()));
        return newRoute;
    }

}
