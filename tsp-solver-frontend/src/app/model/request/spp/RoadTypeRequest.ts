export class RoadTypeRequest {
  id: number;
  type: string;
  weight: number;

  constructor(id: number, type: string, weight: number) {
    this.id = id;
    this.type = type;
    this.weight = weight;
  }

}
