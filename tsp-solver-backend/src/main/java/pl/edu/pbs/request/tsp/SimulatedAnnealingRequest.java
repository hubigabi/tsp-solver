package pl.edu.pbs.request.tsp;

import lombok.Data;

@Data
public class SimulatedAnnealingRequest {

    private double[][] costMatrix;
    private double maxTemperature;
    private double minTemperature;
    private double coolingRate;
    private int iterations;
    private int maxCoolingTemperatureNoImprovement;

}