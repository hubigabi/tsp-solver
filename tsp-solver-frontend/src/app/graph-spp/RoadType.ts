export class RoadType {
  id: number;
  type: string;
  weight: number;
  color: string

  constructor(id: number, type: string, weight: number, color: string) {
    this.id = id;
    this.type = type;
    this.weight = weight;
    this.color = color;
  }

  static getDefault(): RoadType[] {
    return [
      new RoadType(1, 'Road', 1.0, '#0000FF'),
      new RoadType(2, 'Highway', 0.8, '#008000'),
    ];
  }

}
