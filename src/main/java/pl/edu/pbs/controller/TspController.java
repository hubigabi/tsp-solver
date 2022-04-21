package pl.edu.pbs.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pbs.model.request.CityRequest;
import pl.edu.pbs.service.TspService;
import pl.edu.pbs.tsp.Route;

import java.util.List;

@RestController
@RequestMapping("/api/tsp")
@CrossOrigin
@AllArgsConstructor
public class TspController {

    private final TspService tspService;

    @PostMapping(path = "/nearestNeighbour")
    public ResponseEntity<Route> getNearestNeighbour(@RequestBody List<CityRequest> cities) {
        Route route = tspService.getNearestNeighbourRoute(cities);
        return new ResponseEntity<>(route, HttpStatus.OK);
    }

}
