package pl.edu.pbs.request.spp;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.edu.pbs.spp.Route;

@Data
@AllArgsConstructor
public class SppResult {
    private Route[][] routesMatrix;
}
