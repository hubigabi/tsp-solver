package pl.edu.pbs.spp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Route {

    private String from;
    private String to;
    private double cost;

    @JsonIgnore
    private int successorNode;

    private List<String> nodesPath;
    private List<String> edgesPath;
}
