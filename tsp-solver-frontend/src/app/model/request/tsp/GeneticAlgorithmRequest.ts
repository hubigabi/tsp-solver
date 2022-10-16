import {CrossoverType} from "./ga/CrossoverType";
import {SelectionType} from "./ga/SelectionType";

export class GeneticAlgorithmRequest {
  costMatrix: number[][]
  populationSize: number;
  elitismSize: number;
  mutationRate: number;
  epochsNumber: number
  maxEpochsNoImprovement: number
  selectionType: SelectionType
  crossoverType: CrossoverType

  constructor(costMatrix: number[][], populationSize: number, elitismSize: number, mutationRate: number,
              epochsNumber: number, maxEpochsNoImprovement: number, selectionType: SelectionType, crossoverType: CrossoverType) {
    this.costMatrix = costMatrix;
    this.populationSize = populationSize;
    this.elitismSize = elitismSize;
    this.mutationRate = mutationRate;
    this.epochsNumber = epochsNumber;
    this.maxEpochsNoImprovement = maxEpochsNoImprovement;
    this.selectionType = selectionType;
    this.crossoverType = crossoverType;
  }

}
