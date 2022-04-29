package pl.edu.pbs.request.tsp;

import lombok.Data;
import pl.edu.pbs.tsp.City;

import java.util.List;

@Data
public class AntColonyRequest {

    private List<City> cities;
    private double alpha;
    private double beta;
    private double evaporationRate;
    private double q;
    private double antFactor;
    private double randomCitySelection;
    private int maxIterations;

}