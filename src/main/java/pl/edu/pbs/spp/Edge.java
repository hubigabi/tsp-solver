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
}
