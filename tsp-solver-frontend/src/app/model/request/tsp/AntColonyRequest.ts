export class AntColonyRequest {
  costMatrix: number[][]
  alpha: number;
  beta: number;
  evaporationRate: number;
  q: number;
  antFactor: number;
  randomCitySelection: number;
  maxIterations: number;

  constructor(costMatrix: number[][], alpha: number, beta: number, evaporationRate: number,
              q: number, antFactor: number, randomCitySelection: number, maxIterations: number) {
    this.costMatrix = costMatrix;
    this.alpha = alpha;
    this.beta = beta;
    this.evaporationRate = evaporationRate;
    this.q = q;
    this.antFactor = antFactor;
    this.randomCitySelection = randomCitySelection;
    this.maxIterations = maxIterations;
  }

}
