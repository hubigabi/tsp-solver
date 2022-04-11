package pl.edu.pbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import pl.edu.pbs.tsp.City;
import pl.edu.pbs.tsp.Route;
import pl.edu.pbs.tsp.TspGenerator;
import pl.edu.pbs.tsp.algorithm.ga.GeneticAlgorithm;
import pl.edu.pbs.tsp.algorithm.NearestNeighbourAlgorithm;
import pl.edu.pbs.tsp.algorithm.SimulatedAnnealing;
import pl.edu.pbs.tsp.algorithm.ga.SelectionType;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class TspSolverApplication {

    public static void main(String[] args) {
        SpringApplication.run(TspSolverApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void compareAlgorithms() {
        System.out.println("Starting...");
        List<City> cities = TspGenerator.generateCities(50);
        double[][] travellingCostMatrix = TspGenerator.toTravellingCostMatrix(cities);

        Route nearestNeighbourAlgorithmRoute = new NearestNeighbourAlgorithm().getRoute(travellingCostMatrix);
        System.out.println(nearestNeighbourAlgorithmRoute);

//        Route naiveApproachRoute = new NaiveApproach().solve(travellingCostMatrix);
//        System.out.println(naiveApproachRoute);

        List<Route> simulatedAnnealingRoutes = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            Route route = new SimulatedAnnealing(100.0, 0.1, 0.99, 1000).getRoute(travellingCostMatrix);
            simulatedAnnealingRoutes.add(route);
            System.out.println(route);
        }
        simulatedAnnealingRoutes.stream().map(Route::getTotalCost)
                .min(Double::compareTo)
                .ifPresent(min -> System.out.println("Min: " + min));
        simulatedAnnealingRoutes.stream().mapToDouble(Route::getTotalCost)
                .average()
                .ifPresent(avg -> System.out.println("Average: " + avg));

        List<Route> geneticAlgorithmRoutes = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            Route route = new GeneticAlgorithm(100, 20, 20, 10000, 0.02, SelectionType.TOURNAMENT, 10).getRoute(travellingCostMatrix);
            geneticAlgorithmRoutes.add(route);
            System.out.println(route);
        }
        geneticAlgorithmRoutes.stream().map(Route::getTotalCost)
                .min(Double::compareTo)
                .ifPresent(min -> System.out.println("Min: " + min));
        geneticAlgorithmRoutes.stream().mapToDouble(Route::getTotalCost)
                .average()
                .ifPresent(avg -> System.out.println("Average: " + avg));

        System.out.println("Test finished");
    }

}
