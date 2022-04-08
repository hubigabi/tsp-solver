package pl.edu.pbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import pl.edu.pbs.tsp.City;
import pl.edu.pbs.tsp.Route;
import pl.edu.pbs.tsp.TspGenerator;
import pl.edu.pbs.tsp.algorithm.NaiveApproach;
import pl.edu.pbs.tsp.algorithm.NearestNeighbourAlgorithm;

import java.util.List;

@SpringBootApplication
public class TspSolverApplication {

    public static void main(String[] args) {
        SpringApplication.run(TspSolverApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void doSomethingAfterStartup() {
        System.out.println("Start");
        List<City> cities = TspGenerator.generateCities(10);
        double[][] travellingCostMatrix = TspGenerator.toTravellingCostMatrix(cities);

        Route route = new NearestNeighbourAlgorithm().solve(travellingCostMatrix);
        System.out.println(route);

        Route route2 = new NaiveApproach().solve(travellingCostMatrix);
        System.out.println(route2);

        System.out.println("End");
    }

}
