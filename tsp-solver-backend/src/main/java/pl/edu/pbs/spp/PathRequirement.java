package pl.edu.pbs.spp;

import lombok.Data;

import java.util.List;

@Data
public class PathRequirement {

    private double bearingCapacity;
    private List<Integer> roadTypesId;
}
