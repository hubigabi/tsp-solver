package pl.edu.pbs.tsp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Route {

    public double calculationTime;
    public double totalCost;
    public List<Integer> citiesOrder;

}
