package pl.edu.pbs.spp;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Edge {

    private String id;
    private String source;
    private String target;
    private int roadTypeId;
    private double distance;
    private double bearingCapacity;

    /**
     * {@link Edge#cost} = {@link Edge#distance} * {@link RoadType#getWeight()}
     */
    private double cost;
}
