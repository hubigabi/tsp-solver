package pl.edu.pbs.service;

import org.springframework.stereotype.Service;
import pl.edu.pbs.model.request.AntColonyRequest;
import pl.edu.pbs.model.request.CityRequest;
import pl.edu.pbs.model.request.GeneticAlgorithmRequest;
import pl.edu.pbs.model.request.SimulatedAnnealingRequest;
import pl.edu.pbs.tsp.Route;
import pl.edu.pbs.tsp.algorithm.NearestNeighbourAlgorithm;
import pl.edu.pbs.tsp.algorithm.SimulatedAnnealing;
import pl.edu.pbs.tsp.algorithm.TwoOpt;
import pl.edu.pbs.tsp.algorithm.antcolony.AntColonyOptimization;
import pl.edu.pbs.tsp.algorithm.ga.GeneticAlgorithm;
import pl.edu.pbs.tsp.algorithm.ga.SelectionType;

import java.util.List;

@Service
public class TspService {

    public Route getNearestNeighbourRoute(List<CityRequest> cities) {
        double[][] costMatrix = toTravellingCostMatrix(cities);
        return new NearestNeighbourAlgorithm().getRoute(costMatrix);
    }

    public Route getTwoOpt(List<CityRequest> cities) {
        double[][] costMatrix = toTravellingCostMatrix(cities);
        return new TwoOpt().getRoute(costMatrix);
    }

    public Route getSimulatedAnnealing(SimulatedAnnealingRequest request) {
        double[][] costMatrix = toTravellingCostMatrix(request.getCities());
        return new SimulatedAnnealing(request.getMaxTemperature(), request.getMinTemperature(),
                request.getCoolingRate(), request.getEpochsNumber()).getRoute(costMatrix);
    }

    public Route getGeneticAlgorithm(GeneticAlgorithmRequest request) {
        double[][] costMatrix = toTravellingCostMatrix(request.getCities());
        return new GeneticAlgorithm(request.getPopulationSize(), request.getElitismSize(),
                request.getEpochsNumber(), request.getMutationRate(), SelectionType.TOURNAMENT, 10).getRoute(costMatrix);
    }

    public Route getAntColonyOptimization(AntColonyRequest request) {
        double[][] costMatrix = toTravellingCostMatrix(request.getCities());
        return new AntColonyOptimization(request.getAlpha(), request.getBeta(), request.getEvaporationRate(),
                request.getQ(), request.getAntFactor(), request.getRandomCitySelection(), request.getMaxIterations()).getRoute(costMatrix);
    }

    public double[][] toTravellingCostMatrix(List<CityRequest> cities) {
        int citiesNumber = cities.size();
        double[][] travellingCostMatrix = new double[citiesNumber][citiesNumber];

        for (int i = 0; i < citiesNumber; i++) {
            for (int j = 0; j < citiesNumber; j++) {
                travellingCostMatrix[i][j] = getDistance(cities.get(i), cities.get(j));
            }
        }

        return travellingCostMatrix;
    }

    private double getDistance(CityRequest city1, CityRequest city2) {
        double x = Math.abs(city1.getX() - city2.getX());
        double y = Math.abs(city1.getY() - city2.getY());
        return Math.hypot(x, y);
    }

}
