package pl.edu.pbs.service;

import org.springframework.stereotype.Service;
import pl.edu.pbs.model.request.CityRequest;
import pl.edu.pbs.tsp.Route;
import pl.edu.pbs.tsp.algorithm.NearestNeighbourAlgorithm;

import java.util.List;

@Service
public class TspService {

    public Route getNearestNeighbourRoute(List<CityRequest> cities) {
        double[][] costMatrix = toTravellingCostMatrix(cities);
        return new NearestNeighbourAlgorithm().getRoute(costMatrix);
    }

    private static double[][] toTravellingCostMatrix(List<CityRequest> cities) {
        int citiesNumber = cities.size();
        double[][] travellingCostMatrix = new double[citiesNumber][citiesNumber];

        for (int i = 0; i < citiesNumber; i++) {
            for (int j = 0; j < citiesNumber; j++) {
                travellingCostMatrix[i][j] = getDistance(cities.get(i), cities.get(j));
            }
        }

        return travellingCostMatrix;
    }

    private static double getDistance(CityRequest city1, CityRequest city2) {
        double x = Math.abs(city1.getX() - city2.getX());
        double y = Math.abs(city1.getY() - city2.getY());
        return Math.hypot(x, y);
    }

}
