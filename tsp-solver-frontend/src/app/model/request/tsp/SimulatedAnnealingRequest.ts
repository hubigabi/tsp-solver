import {City} from "../../City";

export class SimulatedAnnealingRequest {
  cities: City[]
  maxTemperature: number;
  minTemperature: number;
  coolingRate: number;
  epochsNumber: number

  constructor(cities: City[], maxTemperature: number, minTemperature: number, coolingRate: number, epochsNumber: number) {
    this.cities = cities;
    this.maxTemperature = maxTemperature;
    this.minTemperature = minTemperature;
    this.coolingRate = coolingRate;
    this.epochsNumber = epochsNumber;
  }

}
