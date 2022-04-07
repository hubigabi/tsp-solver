package pl.edu.pbs.tsp;

import lombok.Data;

import java.util.List;

@Data
public class Route {

    public double calculationTime;
    public double totalDistance;
    public List<Integer> citiesOrder;

}
