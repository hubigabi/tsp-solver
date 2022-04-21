package pl.edu.pbs.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.pbs.model.request.CityRequest;
import pl.edu.pbs.service.TspService;
import pl.edu.pbs.tsp.Route;

import java.util.List;

@RestController
@RequestMapping("/tsp")
@AllArgsConstructor
public class TspController {

    final TspService tspService;

    @GetMapping(path = "/nearestNeighbour")
    public ResponseEntity<Route> getNearestNeighbour(@RequestBody List<CityRequest> cities) {
        Route route = tspService.getNearestNeighbourRoute(cities);
        return new ResponseEntity<>(route, HttpStatus.OK);
    }

}
