package pl.edu.pbs.request.spp;

import lombok.Data;
import pl.edu.pbs.spp.Edge;
import pl.edu.pbs.spp.Node;
import pl.edu.pbs.spp.PathRequirement;
import pl.edu.pbs.spp.RoadType;

import java.util.List;

@Data
public class SppRequest {

    private List<Node> nodes;
    private List<RoadType> roadTypes;
    private List<Edge> edges;
    private PathRequirement pathRequirement;

}
