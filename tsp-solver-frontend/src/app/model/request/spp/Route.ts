export class Route {
  from: string;
  to: string;
  cost: number;
  nodesPath: number[]
  edgesPath: number[]

  constructor(from: string, to: string, cost: number, nodesPath: number[], edgesPath: number[]) {
    this.from = from;
    this.to = to;
    this.cost = cost;
    this.nodesPath = nodesPath;
    this.edgesPath = edgesPath;
  }

}
