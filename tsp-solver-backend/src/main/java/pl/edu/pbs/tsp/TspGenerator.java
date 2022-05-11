package pl.edu.pbs.tsp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class TspGenerator {

    public final static double MAX_X = 100;
    public final static double MAX_Y = 100;

    public static List<City> generateCities(int citiesNumber) {
        List<City> cities = new ArrayList<>(citiesNumber);

        for (int i = 0; i < citiesNumber; i++) {
            double x = round(ThreadLocalRandom.current().nextDouble(0, MAX_X), 2);
            double y = round(ThreadLocalRandom.current().nextDouble(0, MAX_Y), 2);
            cities.add(new City(i, x, y));
        }

        return cities;
    }

    private static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

}
