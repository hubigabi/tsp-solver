package pl.edu.pbs.tsp;

import lombok.Data;

@Data
public class Road {

    public int fromCityId;
    public int toCityId;

    public double cost;
    public double distance;
    public RoadType roadType;
    public double bearingCapacity;

    public Road(int fromCityId, int toCityId, double cost) {
        this.fromCityId = fromCityId;
        this.toCityId = toCityId;
        this.cost = cost;
    }
}
