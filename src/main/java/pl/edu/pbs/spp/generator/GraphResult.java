package pl.edu.pbs.spp.generator;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.edu.pbs.spp.Edge;
import pl.edu.pbs.spp.Node;
import pl.edu.pbs.spp.RoadType;

import java.util.List;

@Data
@AllArgsConstructor
public class GraphResult {

    private List<Node> nodes;
    private List<RoadType> roadTypes;
    private List<Edge> edges;

}
