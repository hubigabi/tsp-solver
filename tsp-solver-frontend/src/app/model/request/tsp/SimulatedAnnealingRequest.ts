export class SimulatedAnnealingRequest {
  costMatrix: number[][]
  maxTemperature: number;
  minTemperature: number;
  coolingRate: number;
  iterations: number
  maxCoolingTemperatureNoImprovement: number

  constructor(costMatrix: number[][], maxTemperature: number, minTemperature: number,
              coolingRate: number, iterations: number, maxCoolingTemperatureNoImprovement: number) {
    this.costMatrix = costMatrix;
    this.maxTemperature = maxTemperature;
    this.minTemperature = minTemperature;
    this.coolingRate = coolingRate;
    this.iterations = iterations;
    this.maxCoolingTemperatureNoImprovement = maxCoolingTemperatureNoImprovement;
  }

}
