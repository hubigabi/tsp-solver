package pl.edu.pbs.tsp;

import lombok.AllArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import pl.edu.pbs.tsp.algorithm.NearestNeighbourAlgorithm;
import pl.edu.pbs.tsp.algorithm.SimulatedAnnealing;
import pl.edu.pbs.tsp.algorithm.TwoOpt;
import pl.edu.pbs.tsp.algorithm.antcolony.AntColonyOptimization;
import pl.edu.pbs.tsp.algorithm.ga.GeneticAlgorithm;
import pl.edu.pbs.tsp.algorithm.ga.SelectionType;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class TspAlgorithmTest {

    public final TspService tspService;

    @EventListener(ApplicationReadyEvent.class)
    public void compareAlgorithms() {
        System.out.println("Starting...");
        List<City> cities = TspGenerator.generateCities(100);
        double[][] travellingCostMatrix = tspService.toTravellingCostMatrix(cities);
//        double[][] travellingCostMatrix = tspService.toTravellingCostMatrix(TspProblem.att48Problem);

        System.out.println("Nearest neighbour algorithm");
        Route nearestNeighbourAlgorithmRoute = new NearestNeighbourAlgorithm().getRoute(travellingCostMatrix);
        System.out.println(nearestNeighbourAlgorithmRoute);
        System.out.println("2-opt improvement " + new TwoOpt(nearestNeighbourAlgorithmRoute.getCitiesOrder()).getRoute(travellingCostMatrix));

//        Route naiveApproachRoute = new NaiveApproach().solve(travellingCostMatrix);
//        System.out.println(naiveApproachRoute);

        System.out.println("Ant colony optimization:");
        List<Route> antColonyOptimizationRoutes = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            AntColonyOptimization antColony = new AntColonyOptimization(1, 5, 0.5, 500, 0.8, 0.01, 50, 10);
            Route route = antColony.getRoute(travellingCostMatrix);
            antColonyOptimizationRoutes.add(route);
            System.out.println(route);
        }
        antColonyOptimizationRoutes.stream().map(Route::getTotalCost)
                .min(Double::compareTo)
                .ifPresent(min -> System.out.println("Min: " + min));
        antColonyOptimizationRoutes.stream().mapToDouble(Route::getTotalCost)
                .average()
                .ifPresent(avg -> System.out.println("Average: " + avg));

        System.out.println("Simulated annealing:");
        List<Route> simulatedAnnealingRoutes = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            Route route = new SimulatedAnnealing(100.0, 0.1, 0.99, 1000, 100).getRoute(travellingCostMatrix);
            simulatedAnnealingRoutes.add(route);
            System.out.println(route);
            System.out.println("2-opt improvement " + new TwoOpt(route.getCitiesOrder()).getRoute(travellingCostMatrix));
        }
        simulatedAnnealingRoutes.stream().map(Route::getTotalCost)
                .min(Double::compareTo)
                .ifPresent(min -> System.out.println("Min: " + min));
        simulatedAnnealingRoutes.stream().mapToDouble(Route::getTotalCost)
                .average()
                .ifPresent(avg -> System.out.println("Average: " + avg));

        System.out.println("Genetic algorithm:");
        List<Route> geneticAlgorithmRoutes = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            Route route = new GeneticAlgorithm(100, 20, 10000, 1000, 0.01, SelectionType.TOURNAMENT, 10).getRoute(travellingCostMatrix);
            geneticAlgorithmRoutes.add(route);
            System.out.println(route);
            System.out.println("2-opt improvement " + new TwoOpt(route.getCitiesOrder()).getRoute(travellingCostMatrix));
        }
        geneticAlgorithmRoutes.stream().map(Route::getTotalCost)
                .min(Double::compareTo)
                .ifPresent(min -> System.out.println("Min: " + min));
        geneticAlgorithmRoutes.stream().mapToDouble(Route::getTotalCost)
                .average()
                .ifPresent(avg -> System.out.println("Average: " + avg));

        System.out.println("2-opt:");
        List<Route> twoOptRoutes = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            Route route = new TwoOpt().getRoute(travellingCostMatrix);
            twoOptRoutes.add(route);
            System.out.println(route);
        }
        twoOptRoutes.stream().map(Route::getTotalCost)
                .min(Double::compareTo)
                .ifPresent(min -> System.out.println("Min: " + min));
        twoOptRoutes.stream().mapToDouble(Route::getTotalCost)
                .average()
                .ifPresent(avg -> System.out.println("Average: " + avg));

        System.out.println("Test finished");
    }

}
