package pl.edu.pbs.model.request;

import lombok.Data;

import java.util.List;

@Data
public class SimulatedAnnealingRequest {

    private List<CityRequest> cities;
    private double maxTemperature;
    private double minTemperature;
    private double coolingRate;
    private int epochsNumber;

}