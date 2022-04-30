package pl.edu.pbs.spp;

import org.springframework.stereotype.Service;
import pl.edu.pbs.request.spp.SppRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SppService {

    public Route[][] solve(SppRequest request) {
        List<Node> nodes = request.getNodes();
        List<RoadType> roadTypes = request.getRoadTypes();

        List<Edge> edges = processPathRequirement(request.getEdges(), request.getPathRequirement());
        setEdgesCost(edges, roadTypes);

        Route[][] routeMatrix = new Route[nodes.size()][nodes.size()];

        for (int i = 0; i < nodes.size(); i++) {
            String source = nodes.get(i).getId();
            for (int j = 0; j < nodes.size(); j++) {
                String target = nodes.get(j).getId();
                double cost;
                if (i == j) {
                    cost = 0;
                } else {
                    cost = edges.stream()
                            .filter(edge -> edge.getSource().equals(source) && edge.getTarget().equals(target))
                            .map(Edge::getCost)
                            .min(Double::compareTo)
                            .orElse(Double.MAX_VALUE);
                }
                boolean isDirected = (cost != Double.MAX_VALUE);

                routeMatrix[i][j] = new Route(source, target, isDirected, cost);
            }
        }

        printMatrix(routeMatrix);
        System.out.println();
        floydWarshall(routeMatrix);
        printMatrix(routeMatrix);
        changeInfinityCost(routeMatrix);
        return routeMatrix;
    }

    private List<Edge> processPathRequirement(List<Edge> edges, PathRequirement pathRequirement) {
        double bearingCapacity = pathRequirement.getBearingCapacity();
        return edges.stream()
                .filter(edge -> edge.getBearingCapacity() >= bearingCapacity)
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
                    }
                }
            }
        }
    }

    private void printMatrix(Route[][] routeMatrix) {
        for (int i = 0; i < routeMatrix.length; i++) {
            for (int j = 0; j < routeMatrix.length; j++) {
                if (routeMatrix[i][j].getCost() == Double.MAX_VALUE) {
                    System.out.print("INF ");
                } else {
                    System.out.print(routeMatrix[i][j].getCost() + "  ");
                }
            }
            System.out.println();
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

}
