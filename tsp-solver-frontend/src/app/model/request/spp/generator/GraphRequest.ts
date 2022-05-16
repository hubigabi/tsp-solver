export class GraphRequest {
  nodesNumber: number;
  symmetric: boolean

  constructor(nodesNumber: number, symmetric: boolean) {
    this.nodesNumber = nodesNumber;
    this.symmetric = symmetric;
  }

}


