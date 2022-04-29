export class EdgeRequest {
  id: string;
  source: string;
  target: string;
  distance: number;
  roadTypeId: number;
  bearingCapacity: number

  constructor(id: string, source: string, target: string, distance: number,
              roadTypeId: number, bearingCapacity: number) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.distance = distance;
    this.roadTypeId = roadTypeId;
    this.bearingCapacity = bearingCapacity;
  }

}
