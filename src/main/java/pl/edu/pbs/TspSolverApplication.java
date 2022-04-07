package pl.edu.pbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import pl.edu.pbs.tsp.City;
import pl.edu.pbs.tsp.Tsp;

import java.util.List;

@SpringBootApplication
public class TspSolverApplication {

	public static void main(String[] args) {
		SpringApplication.run(TspSolverApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void doSomethingAfterStartup() {
		System.out.println("Start");
		List<City> cities = Tsp.generateCities(10);
		System.out.println("End");
	}

}
