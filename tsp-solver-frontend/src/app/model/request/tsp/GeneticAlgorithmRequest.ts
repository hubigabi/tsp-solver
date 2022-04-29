import {City} from "../../City";

export class GeneticAlgorithmRequest {
  cities: City[]
  populationSize: number;
  elitismSize: number;
  mutationRate: number;
  epochsNumber: number

  constructor(cities: City[], populationSize: number, elitismSize: number, mutationRate: number, epochsNumber: number) {
    this.cities = cities;
    this.populationSize = populationSize;
    this.elitismSize = elitismSize;
    this.mutationRate = mutationRate;
    this.epochsNumber = epochsNumber;
  }

}
