package pl.edu.pbs.request.tsp;

import lombok.Data;

@Data
public class GeneticAlgorithmRequest {

    private double[][] costMatrix;
    private int populationSize;
    private int elitismSize;
    private double mutationRate;
    private int epochsNumber;
    private int maxEpochsNoImprovement;

}