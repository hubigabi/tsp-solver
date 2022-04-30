package pl.edu.pbs.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pbs.request.spp.SppRequest;
import pl.edu.pbs.request.spp.SppResult;
import pl.edu.pbs.spp.Route;
import pl.edu.pbs.spp.SppService;

@RestController
@RequestMapping("/api/spp")
@CrossOrigin
@AllArgsConstructor
public class SppController {

    private final SppService sppService;

    @PostMapping
    public ResponseEntity<SppResult> getSppResult(@RequestBody SppRequest request) {
        Route[][] routesMatrix = sppService.solve(request);
        return new ResponseEntity<>(new SppResult(routesMatrix), HttpStatus.OK);
    }

}
