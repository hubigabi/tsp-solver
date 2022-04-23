package pl.edu.pbs.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CityRequest {

    private int id;
    private double x;
    private double y;

}