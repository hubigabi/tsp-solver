package pl.edu.pbs.spp.generator;

import org.jgrapht.Graph;
import org.jgrapht.generate.WattsStrogatzGraphGenerator;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.graph.SimpleDirectedGraph;
import org.jgrapht.util.SupplierUtil;
import org.springframework.stereotype.Service;
import pl.edu.pbs.spp.Edge;
import pl.edu.pbs.spp.Node;
import pl.edu.pbs.spp.RoadType;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Service
public class GraphGeneratorService {

    public GraphResult generateGraph(GraphRequest request) {
        Supplier<String> vSupplier = new Supplier<>() {
            private int id = 0;

            @Override
            public String get() {
                return generateNodeName(id++);
            }
        };

        Graph<String, DefaultEdge> graph = new SimpleDirectedGraph<>(vSupplier, SupplierUtil.createDefaultEdgeSupplier(), false);
        WattsStrogatzGraphGenerator<String, DefaultEdge> graphGenerator =
                new WattsStrogatzGraphGenerator<>(request.getNodesNumber(), 10, 0.1);
        graphGenerator.generateGraph(graph);

        List<Node> nodes = graph.vertexSet().stream()
                .map(Node::new)
                .collect(Collectors.toList());

        List<RoadType> roadTypes = List.of(
                new RoadType(1, "Road", 1.0),
                new RoadType(2, "Highway", 0.8),
                new RoadType(3, "State highway", 0.9)
        );

        List<Edge> edges = graph.edgeSet().stream()
                .map(edge -> {
                    String source = graph.getEdgeSource(edge);
                    String target = graph.getEdgeTarget(edge);
                    String id = source + target + "-" + UUID.randomUUID();
                    RoadType roadType = roadTypes.get(ThreadLocalRandom.current().nextInt(0, roadTypes.size()));
                    double distance = ThreadLocalRandom.current().nextInt(1, 20);
                    double bearingCapacity = ThreadLocalRandom.current().nextInt(5, 50);
                    double cost = distance * roadType.getWeight();
                    return new Edge(id, source, target, roadType.getId(), distance, bearingCapacity, cost);
                }).collect(Collectors.toList());

        return new GraphResult(nodes, roadTypes, edges);
    }

    private static String generateNodeName(int i) {
        return i < 0 ? "" : generateNodeName((i / 26) - 1) + (char) (65 + i % 26);
    }

}
