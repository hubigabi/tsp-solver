package pl.edu.pbs.model.request;

import lombok.Data;

import java.util.List;

@Data
public class AntColonyRequest {

    private List<CityRequest> cities;
    private double alpha;
    private double beta;
    private double evaporationRate;
    private double q;
    private double antFactor;
    private double randomCitySelection;
    private int maxIterations;

}