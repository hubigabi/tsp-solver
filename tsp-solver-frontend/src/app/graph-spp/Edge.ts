import {RoadType} from "./RoadType";

export class Edge {
  id: string;
  source: string;
  target: string;
  distance: number;
  roadType: RoadType;
  bearingCapacity: number
  color: string

  constructor(id: string, source: string, target: string, distance: number, roadType: RoadType,
              bearingCapacity: number, color: string) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.distance = distance;
    this.roadType = roadType;
    this.bearingCapacity = bearingCapacity;
    this.color = color;
  }

}
