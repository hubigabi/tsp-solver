import {City} from "../City";

export class AntColonyRequest {
  cities: City[]
  alpha: number;
  beta: number;
  evaporationRate: number;
  q: number;
  antFactor: number;
  randomCitySelection: number;
  maxIterations: number;

  constructor(cities: City[], alpha: number, beta: number, evaporationRate: number, q: number,
              antFactor: number, randomCitySelection: number, maxIterations: number) {
    this.cities = cities;
    this.alpha = alpha;
    this.beta = beta;
    this.evaporationRate = evaporationRate;
    this.q = q;
    this.antFactor = antFactor;
    this.randomCitySelection = randomCitySelection;
    this.maxIterations = maxIterations;
  }

}
