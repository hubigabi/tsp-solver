import {RoadType} from "./RoadType";

export class Edge {
  id: string;
  source: number;
  target: string;
  distance: number;
  roadType: RoadType;
  bearingCapacity: number

  constructor(id: string, source: number, target: string, distance: number,
              roadType: RoadType, bearingCapacity: number) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.distance = distance;
    this.roadType = roadType;
    this.bearingCapacity = bearingCapacity;
  }

}
