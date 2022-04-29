package pl.edu.pbs.request.tsp;

import lombok.Data;
import pl.edu.pbs.tsp.City;

import java.util.List;

@Data
public class SimulatedAnnealingRequest {

    private List<City> cities;
    private double maxTemperature;
    private double minTemperature;
    private double coolingRate;
    private int epochsNumber;

}