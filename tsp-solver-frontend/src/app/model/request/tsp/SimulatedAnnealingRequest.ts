export class SimulatedAnnealingRequest {
  costMatrix: number[][]
  maxTemperature: number;
  minTemperature: number;
  coolingRate: number;
  epochsNumber: number

  constructor(costMatrix: number[][], maxTemperature: number, minTemperature: number,
              coolingRate: number, epochsNumber: number) {
    this.costMatrix = costMatrix;
    this.maxTemperature = maxTemperature;
    this.minTemperature = minTemperature;
    this.coolingRate = coolingRate;
    this.epochsNumber = epochsNumber;
  }

}
