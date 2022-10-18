export class GraphRequest {
  nodesNumber: number;
  symmetric: boolean;
  lang: string;

  constructor(nodesNumber: number, symmetric: boolean, lang: string) {
    this.nodesNumber = nodesNumber;
    this.symmetric = symmetric;
    this.lang = lang;
  }

}


