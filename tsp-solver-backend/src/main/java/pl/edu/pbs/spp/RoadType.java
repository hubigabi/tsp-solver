package pl.edu.pbs.spp;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoadType {

    private int id;
    private String type;
    private double weight;
}
