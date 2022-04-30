export class Route {
  from: string;
  to: string;
  isDirected: boolean;
  cost: number;

  constructor(from: string, to: string, isDirected: boolean, cost: number) {
    this.from = from;
    this.to = to;
    this.isDirected = isDirected;
    this.cost = cost;
  }

}
