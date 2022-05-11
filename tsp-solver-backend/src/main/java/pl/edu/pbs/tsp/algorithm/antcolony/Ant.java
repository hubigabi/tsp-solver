package pl.edu.pbs.tsp.algorithm.antcolony;

public class Ant {

    int citiesNumber;
    /**
     * City order from starting city to the last city,
     * does not include return to the starting city
     */
    public int[] citiesOrder;
    public boolean[] visited;

    public Ant(int citiesNumber) {
        this.citiesNumber = citiesNumber;
        this.citiesOrder = new int[citiesNumber];
        this.visited = new boolean[citiesNumber];
    }

    public void visitCity(int index, int city) {
        citiesOrder[index] = city;
        visited[city] = true;
    }

    public boolean isVisited(int i) {
        return visited[i];
    }

    public double getTrailLength(double[][] costMatrix) {
        double length = 0;
        for (int i = 0; i < citiesNumber - 1; i++) {
            length += costMatrix[citiesOrder[i]][citiesOrder[i + 1]];
        }
        //Adding the distance from the last city to the first one
        length += costMatrix[citiesOrder[citiesNumber - 1]][citiesOrder[0]];

        return length;
    }

    public void clear() {
        for (int i = 0; i < citiesNumber; i++) {
            visited[i] = false;
        }
    }

}