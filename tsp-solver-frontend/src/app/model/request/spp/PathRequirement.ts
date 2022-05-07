export class PathRequirement {
  bearingCapacity: number;
  roadTypesId: number[]

  constructor(bearingCapacity: number, roadTypesId: number[]) {
    this.bearingCapacity = bearingCapacity;
    this.roadTypesId = roadTypesId;
  }

}
