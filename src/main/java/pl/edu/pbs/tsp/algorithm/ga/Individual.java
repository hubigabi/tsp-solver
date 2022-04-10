package pl.edu.pbs.tsp.algorithm.ga;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Individual {

    public List<Integer> citiesOrder;
    public double totalCost;

    /**
     * 1 / {@link Individual#totalCost}
     */
    public double fitness;

}
