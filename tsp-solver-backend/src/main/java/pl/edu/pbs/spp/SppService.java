package pl.edu.pbs.spp;

import lombok.AllArgsConstructor;
import lombok.Value;
import org.springframework.stereotype.Service;
import pl.edu.pbs.request.spp.SppRequest;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SppService {

    public Route[][] solve(SppRequest request) {
        List<Node> nodes = request.getNodes();
        List<RoadType> roadTypes = request.getRoadTypes();

        List<Edge> edges = processPathRequirement(request.getEdges(), request.getPathRequirement());
        setEdgesCost(edges, roadTypes);

        Route[][] routeMatrix = new Route[nodes.size()][nodes.size()];
        HashMap<EdgeKey, Edge> edgesMap = new HashMap<>();

        for (int i = 0; i < nodes.size(); i++) {
            String source = nodes.get(i).getId();
            for (int j = 0; j < nodes.size(); j++) {
                String target = nodes.get(j).getId();
                double cost;
                int successorNode;
                if (i == j) {
                    cost = 0;
                    successorNode = -1;
                } else {
                    Optional<Edge> edge = edges.stream()
                            .filter(e -> e.getSource().equals(source) && e.getTarget().equals(target))
                            .min(Comparator.comparingDouble(Edge::getCost));

                    if (edge.isPresent()) {
                        cost = edge.get().getCost();
                        successorNode = j;
                        edgesMap.put(new EdgeKey(source, target), edge.get());
                    } else {
                        cost = Double.MAX_VALUE;
                        successorNode = -1;
                    }

                }

                routeMatrix[i][j] = new Route(source, target, cost, successorNode, new ArrayList<>(), new ArrayList<>());
            }
        }

        floydWarshall(routeMatrix);
        setPath(routeMatrix, edgesMap);
        changeInfinityCost(routeMatrix);
        return routeMatrix;
    }

    private List<Edge> processPathRequirement(List<Edge> edges, PathRequirement pathRequirement) {
        double bearingCapacity = pathRequirement.getBearingCapacity();
        List<Integer> roadTypesId = pathRequirement.getRoadTypesId();
        return edges.stream()
                .filter(edge -> edge.getBearingCapacity() >= bearingCapacity)
                .filter(edge -> roadTypesId.contains(edge.getRoadTypeId()))
                .collect(Collectors.toList());
    }

    private void setEdgesCost(List<Edge> edges, List<RoadType> roadTypes) {
        for (Edge edge : edges) {
            double roadWeight = roadTypes.stream()
                    .filter(roadType -> roadType.getId() == edge.getRoadTypeId())
                    .findFirst()
                    .orElseThrow()
                    .getWeight();
            edge.setCost(edge.getDistance() * roadWeight);
        }
    }

    void floydWarshall(Route[][] matrix) {
        int n = matrix.length;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                for (int k = 0; k < n; k++) {
                    if (matrix[j][i].getCost() + matrix[i][k].getCost() < matrix[j][k].getCost()) {
                        matrix[j][k].setCost(matrix[j][i].getCost() + matrix[i][k].getCost());
                        matrix[j][k].setSuccessorNode(matrix[j][i].getSuccessorNode());
                    }
                }
            }
        }
    }

    private void setPath(Route[][] routeMatrix, HashMap<EdgeKey, Edge> edgesMap) {
        for (int i = 0; i < routeMatrix.length; i++) {
            for (int j = 0; j < routeMatrix.length; j++) {

                if (routeMatrix[i][j].getSuccessorNode() == -1) {
                    routeMatrix[i][j].setNodesPath(new ArrayList<>());
                } else {
                    List<String> path = new ArrayList<>();
                    path.add(routeMatrix[i][0].getFrom());

                    int index = i;
                    while (index != j) {
                        index = routeMatrix[index][j].getSuccessorNode();
                        path.add(routeMatrix[index][0].getFrom());
                    }

                    routeMatrix[i][j].setNodesPath(List.copyOf(path));

                    List<String> edgesPath = new ArrayList<>();
                    for (int k = 0; k < path.size() - 1; k++) {
                        EdgeKey edgeKey = new EdgeKey(path.get(k), path.get(k + 1));
                        Edge edge = edgesMap.get(edgeKey);
                        if (edge != null) {
                            edgesPath.add(edge.getId());
                        } else {
                            throw new RuntimeException("Edge connecting " + path.get(k)
                                    + " and " + path.get(k + 1) + " not found");
                        }
                    }

                    routeMatrix[i][j].setEdgesPath(edgesPath);
                }
            }
        }
    }

    private void changeInfinityCost(Route[][] routeMatrix) {
        final double INFINITY = -1;
        for (int i = 0; i < routeMatrix.length; i++) {
            for (int j = 0; j < routeMatrix.length; j++) {
                if (routeMatrix[i][j].getCost() == Double.MAX_VALUE) {
                    routeMatrix[i][j].setCost(INFINITY);
                }
            }
        }
    }

    @Value
    @AllArgsConstructor
    public static class EdgeKey {
        String fromNode;
        String toNode;
    }


}
