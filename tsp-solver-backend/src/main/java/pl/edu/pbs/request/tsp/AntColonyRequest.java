package pl.edu.pbs.request.tsp;

import lombok.Data;

@Data
public class AntColonyRequest {

    private double[][] costMatrix;
    private double alpha;
    private double beta;
    private double evaporationRate;
    private double q;
    private double antFactor;
    private double randomCitySelection;
    private int iterations;
    private int maxIterationsNoImprovement;
}