package pl.edu.pbs.tsp;

import org.springframework.stereotype.Service;
import pl.edu.pbs.request.tsp.AntColonyRequest;
import pl.edu.pbs.request.tsp.GeneticAlgorithmRequest;
import pl.edu.pbs.request.tsp.SimulatedAnnealingRequest;
import pl.edu.pbs.tsp.algorithm.NearestNeighbourAlgorithm;
import pl.edu.pbs.tsp.algorithm.SimulatedAnnealing;
import pl.edu.pbs.tsp.algorithm.TwoOpt;
import pl.edu.pbs.tsp.algorithm.antcolony.AntColonyOptimization;
import pl.edu.pbs.tsp.algorithm.ga.GeneticAlgorithm;
import pl.edu.pbs.tsp.algorithm.ga.SelectionType;

import java.util.List;

@Service
public class TspService {

    public Route getNearestNeighbourRoute(double[][] costMatrix) {
        return new NearestNeighbourAlgorithm().getRoute(costMatrix);
    }

    public Route getTwoOpt(double[][] costMatrix) {
        return new TwoOpt().getRoute(costMatrix);
    }

    public Route getSimulatedAnnealing(SimulatedAnnealingRequest request) {
        int maxIterationsNoImprovement = request.getMaxIterationsNoImprovement() != -1 ? request.getMaxIterationsNoImprovement() : request.getIterations();
        return new SimulatedAnnealing(request.getMaxTemperature(), request.getMinTemperature(),
                request.getCoolingRate(), request.getIterations(), maxIterationsNoImprovement).getRoute(request.getCostMatrix());
    }

    public Route getGeneticAlgorithm(GeneticAlgorithmRequest request) {
        int maxEpochsNoImprovement = request.getMaxEpochsNoImprovement() != -1 ? request.getMaxEpochsNoImprovement() : request.getEpochsNumber();
        return new GeneticAlgorithm(request.getPopulationSize(), request.getElitismSize(),
                request.getEpochsNumber(), maxEpochsNoImprovement, request.getMutationRate(), SelectionType.TOURNAMENT, 10).getRoute(request.getCostMatrix());
    }

    public Route getAntColonyOptimization(AntColonyRequest request) {
        int maxIterationsNoImprovement = request.getMaxIterationsNoImprovement() != -1 ? request.getMaxIterationsNoImprovement() : request.getIterations();
        return new AntColonyOptimization(request.getAlpha(), request.getBeta(), request.getEvaporationRate(), request.getQ(), request.getAntFactor(),
                request.getRandomCitySelection(), request.getIterations(), maxIterationsNoImprovement).getRoute(request.getCostMatrix());
    }

    public double[][] toTravellingCostMatrix(List<City> cities) {
        int citiesNumber = cities.size();
        double[][] travellingCostMatrix = new double[citiesNumber][citiesNumber];

        for (int i = 0; i < citiesNumber; i++) {
            for (int j = 0; j < citiesNumber; j++) {
                travellingCostMatrix[i][j] = getDistance(cities.get(i), cities.get(j));
            }
        }

        return travellingCostMatrix;
    }

    private double getDistance(City city1, City city2) {
        double x = Math.abs(city1.getX() - city2.getX());
        double y = Math.abs(city1.getY() - city2.getY());
        return Math.hypot(x, y);
    }

}
