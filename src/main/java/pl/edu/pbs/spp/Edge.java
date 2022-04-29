package pl.edu.pbs.spp;

import lombok.Data;

@Data
public class Edge {

    private String id;
    private String source;
    private String target;
    private double distance;
    private double roadTypeId;
    private double bearingCapacity;

    /**
     * {@link Edge#cost} = {@link Edge#distance} * {@link RoadType#getWeight()}
     */
    private double cost;
}
