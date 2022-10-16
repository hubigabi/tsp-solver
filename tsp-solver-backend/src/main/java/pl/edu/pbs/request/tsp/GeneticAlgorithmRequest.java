package pl.edu.pbs.request.tsp;

import lombok.Data;
import pl.edu.pbs.tsp.algorithm.ga.CrossoverType;
import pl.edu.pbs.tsp.algorithm.ga.SelectionType;

@Data
public class GeneticAlgorithmRequest {

    private double[][] costMatrix;
    private int populationSize;
    private int elitismSize;
    private double mutationRate;
    private int epochsNumber;
    private int maxEpochsNoImprovement;
    private SelectionType selectionType;
    private CrossoverType crossoverType;

}
