package pl.edu.pbs.spp;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Route {

    private String from;
    private String to;
    private boolean isDirected;
    private double cost;
}
