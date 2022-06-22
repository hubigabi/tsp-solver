# TSP Solver
TSP Solver is a web application for solving travelling salesman problem.  
The main goal of this project is to compare the following algorithms:
- nearest neighbour
- 2-opt
- simulated annealing
- genetic algorithm
- ant colony optimization

## Technologies
- Spring Boot
- Angular
- Cytoscape.js

## Demo
The application is available here: https://tsp-solver1.herokuapp.com 
It's used the free deployment option on [Heroku](https://www.heroku.com), so if the application hasn't been used for a longer time, rebuilding will be necessary after a new request was sent. This process takes about **20** seconds.

![Road network](https://i.imgur.com/Bhpf10d.png)
![Cities](https://i.imgur.com/0NOrQgI.png)

## Usage
Clone this repository and go to the root project directory:
```shell
$ git clone https://github.com/hubigabi/tsp-solver.git
$ cd tsp-solver
```

Build the application:
```shell
$ mvn package
```

Run the application:
```shell
$ java -jar tsp-solver-backend/target/tsp-solver-backend-*.jar
```
The application will be working on: http://localhost:8080

## Created by
[Hubert Gabryszewski](https://github.com/hubigabi)
