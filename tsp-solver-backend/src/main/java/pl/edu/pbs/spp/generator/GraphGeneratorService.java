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
import java.util.stream.Stream;

@Service
public class GraphGeneratorService {

    private static final double rewiringEdgeProbability = 0.1;

    public GraphResult generateGraph(GraphRequest request) {
        Supplier<String> vSupplier = new Supplier<>() {
            private int id = 0;

            @Override
            public String get() {
                return generateNodeName(id++);
            }
        };

        Graph<String, DefaultEdge> graph = new SimpleDirectedGraph<>(vSupplier, SupplierUtil.createDefaultEdgeSupplier(), false);
        int nodesNumber = request.getNodesNumber();
        int k = (int) Math.ceil(Math.log(nodesNumber + nodesNumber * rewiringEdgeProbability));
        // k must be even
        if ((k % 2) != 0) {
            k++;
        }

        WattsStrogatzGraphGenerator<String, DefaultEdge> graphGenerator =
                new WattsStrogatzGraphGenerator<>(nodesNumber, k, rewiringEdgeProbability);
        graphGenerator.generateGraph(graph);

        List<Node> nodes = graph.vertexSet().stream()
                .map(Node::new)
                .collect(Collectors.toList());

        boolean langPl = "pl".equals(request.getLang());
        List<RoadType> roadTypes = List.of(
                new RoadType(2, langPl ? "Autostrady" : "Highway", 0.7),
                new RoadType(3, langPl ? "Drogi ekspresowe" : "State highway", 0.8),
                new RoadType(1, langPl ? "Drogi krajowe" : "County highways", 1.0)
        );

        boolean symmetric = request.isSymmetric();
        List<Edge> edges = graph.edgeSet().stream()
                .flatMap(edge -> {
                    String source = graph.getEdgeSource(edge);
                    String target = graph.getEdgeTarget(edge);
                    String id1 = source + target + "-" + UUID.randomUUID();
                    RoadType roadType = roadTypes.get(ThreadLocalRandom.current().nextInt(0, roadTypes.size()));
                    double distance = ThreadLocalRandom.current().nextInt(1, 20);
                    double bearingCapacity = ThreadLocalRandom.current().nextInt(10, 50);
                    double cost = distance * roadType.getWeight();
                    Edge edge1 = new Edge(id1, source, target, roadType.getId(), distance, bearingCapacity, cost);

                    if (symmetric) {
                        String id2 = target + source + "-" + UUID.randomUUID();
                        Edge edge2 = new Edge(id2, target, source, roadType.getId(), distance, bearingCapacity, cost);
                        return Stream.of(edge1, edge2);
                    } else {
                        return Stream.of(edge1);
                    }
                }).collect(Collectors.toList());

        return new GraphResult(nodes, roadTypes, edges);
    }

    private static String generateNodeName(int i) {
        return i < 0 ? "" : generateNodeName((i / 26) - 1) + (char) (65 + i % 26);
    }

}
