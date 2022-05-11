package pl.edu.pbs.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pbs.request.spp.SppRequest;
import pl.edu.pbs.request.spp.SppResult;
import pl.edu.pbs.spp.Route;
import pl.edu.pbs.spp.SppService;
import pl.edu.pbs.spp.generator.GraphGeneratorService;
import pl.edu.pbs.spp.generator.GraphRequest;
import pl.edu.pbs.spp.generator.GraphResult;

@RestController
@RequestMapping("/api/spp")
@CrossOrigin
@AllArgsConstructor
public class SppController {

    private final SppService sppService;
    private final GraphGeneratorService graphGeneratorService;

    @PostMapping
    public ResponseEntity<SppResult> getSppResult(@RequestBody SppRequest request) {
        Route[][] routesMatrix = sppService.solve(request);
        return new ResponseEntity<>(new SppResult(routesMatrix), HttpStatus.OK);
    }

    @PostMapping("/generate-graph")
    public ResponseEntity<GraphResult> generateGraph(@RequestBody GraphRequest request) {
        return new ResponseEntity<>(graphGeneratorService.generateGraph(request), HttpStatus.OK);
    }

}
