export class GeneticAlgorithmRequest {
  costMatrix: number[][]
  populationSize: number;
  elitismSize: number;
  mutationRate: number;
  epochsNumber: number

  constructor(costMatrix: number[][], populationSize: number, elitismSize: number,
              mutationRate: number, epochsNumber: number) {
    this.costMatrix = costMatrix;
    this.populationSize = populationSize;
    this.elitismSize = elitismSize;
    this.mutationRate = mutationRate;
    this.epochsNumber = epochsNumber;
  }

}
