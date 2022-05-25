export class GeneticAlgorithmRequest {
  costMatrix: number[][]
  populationSize: number;
  elitismSize: number;
  mutationRate: number;
  epochsNumber: number
  maxEpochsNoImprovement: number

  constructor(costMatrix: number[][], populationSize: number, elitismSize: number,
              mutationRate: number, epochsNumber: number, maxEpochsNoImprovement: number) {
    this.costMatrix = costMatrix;
    this.populationSize = populationSize;
    this.elitismSize = elitismSize;
    this.mutationRate = mutationRate;
    this.epochsNumber = epochsNumber;
    this.maxEpochsNoImprovement = maxEpochsNoImprovement;
  }

}
