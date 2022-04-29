import {NodeRequest} from "./NodeRequest";
import {EdgeRequest} from "./EdgeRequest";
import {PathRequirement} from "./PathRequirement";
import {RoadTypeRequest} from "./RoadTypeRequest";

export class SppRequest {
  nodes: NodeRequest[];
  roadTypes: RoadTypeRequest[];
  edges: EdgeRequest[];
  pathRequirement: PathRequirement;

  constructor(nodes: NodeRequest[], roadTypes: RoadTypeRequest[], edges: EdgeRequest[], pathRequirement: PathRequirement) {
    this.nodes = nodes;
    this.roadTypes = roadTypes;
    this.edges = edges;
    this.pathRequirement = pathRequirement;
  }

}
