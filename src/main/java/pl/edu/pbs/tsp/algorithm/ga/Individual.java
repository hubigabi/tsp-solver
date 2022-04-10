package pl.edu.pbs.tsp.algorithm.ga;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Individual {

    public List<Integer> citiesOrder;
    public double totalCost;

}
