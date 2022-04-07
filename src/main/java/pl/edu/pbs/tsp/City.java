package pl.edu.pbs.tsp;

import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class City {

    public int id;
    public double x;
    public double y;

    public Map<Integer, List<Road>> roads = new HashMap<>();
    public Map<Integer, Road> optimalRoads = new HashMap<>();

    public City(int id, double x, double y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}
