package pl.edu.pbs.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pbs.model.request.AntColonyRequest;
import pl.edu.pbs.model.request.CityRequest;
import pl.edu.pbs.model.request.GeneticAlgorithmRequest;
import pl.edu.pbs.model.request.SimulatedAnnealingRequest;
import pl.edu.pbs.service.TspService;
import pl.edu.pbs.tsp.Route;

import java.util.List;

@RestController
@RequestMapping("/api/tsp")
@CrossOrigin
@AllArgsConstructor
public class TspController {

    private final TspService tspService;

    @PostMapping(path = "/nearest-neighbour")
    public ResponseEntity<Route> getNearestNeighbour(@RequestBody List<CityRequest> cities) {
        Route route = tspService.getNearestNeighbourRoute(cities);
        return new ResponseEntity<>(route, HttpStatus.OK);
    }

    @PostMapping(path = "/two-opt")
    public ResponseEntity<Route> getTwoOpt(@RequestBody List<CityRequest> cities) {
        Route route = tspService.getTwoOpt(cities);
        return new ResponseEntity<>(route, HttpStatus.OK);
    }

    @PostMapping(path = "/simulated-annealing")
    public ResponseEntity<Route> getSimulatedAnnealing(@RequestBody SimulatedAnnealingRequest simulatedAnnealingRequest) {
        Route route = tspService.getSimulatedAnnealing(simulatedAnnealingRequest);
        return new ResponseEntity<>(route, HttpStatus.OK);
    }

    @PostMapping(path = "/genetic-algorithm")
    public ResponseEntity<Route> getGeneticAlgorithm(@RequestBody GeneticAlgorithmRequest geneticAlgorithmRequest) {
        Route route = tspService.getGeneticAlgorithm(geneticAlgorithmRequest);
        return new ResponseEntity<>(route, HttpStatus.OK);
    }

    @PostMapping(path = "/ant-colony")
    public ResponseEntity<Route> getAntColonyOptimization(@RequestBody AntColonyRequest antColonyRequest) {
        Route route = tspService.getAntColonyOptimization(antColonyRequest);
        return new ResponseEntity<>(route, HttpStatus.OK);
    }

}
