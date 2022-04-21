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

        for (int i = 0; i < citiesNumber; i++) {
            City fromCity = cities.get(i);

            for (int j = 0; j < citiesNumber; j++) {
                City toCity = cities.get(j);
                double distance = getDistance(fromCity, toCity);

                Road road = new Road(i, j, distance);
                cities.get(i).getOptimalRoads().put(j, road);
            }
        }

        return cities;
    }

    private static double getDistance(City fromCity, City toCity) {
        double x = Math.abs(fromCity.getX() - toCity.getX());
        double y = Math.abs(fromCity.getY() - toCity.getY());
        return Math.hypot(x, y);
    }

    private static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

    public static double[][] toTravellingCostMatrix(List<City> cities) {
        int citiesNumber = cities.size();
        double[][] travellingCostMatrix = new double[citiesNumber][citiesNumber];

        for (int i = 0; i < citiesNumber; i++) {
            double[] row = new double[citiesNumber];
            for (int j = 0; j < citiesNumber; j++) {
                row[j] = cities.get(i).getOptimalRoads().get(j).getCost();
            }
            travellingCostMatrix[i] = row;
        }

        return travellingCostMatrix;
    }

}
