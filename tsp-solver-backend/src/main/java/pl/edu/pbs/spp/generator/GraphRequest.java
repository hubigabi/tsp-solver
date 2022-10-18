package pl.edu.pbs.spp.generator;

import lombok.Data;

@Data
public class GraphRequest {

    private int nodesNumber;
    private boolean symmetric;
    private String lang;
}
