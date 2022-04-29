package pl.edu.pbs.request.tsp;

import lombok.Data;
import pl.edu.pbs.tsp.City;

import java.util.List;

@Data
public class GeneticAlgorithmRequest {

    private List<City> cities;
    private int populationSize;
    private int elitismSize;
    private double mutationRate;
    private int epochsNumber;

}