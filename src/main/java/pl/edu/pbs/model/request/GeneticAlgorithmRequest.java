package pl.edu.pbs.model.request;

import lombok.Data;

import java.util.List;

@Data
public class GeneticAlgorithmRequest {

    private List<CityRequest> cities;
    private int populationSize;
    private int elitismSize;
    private double mutationRate;
    private int epochsNumber;

}