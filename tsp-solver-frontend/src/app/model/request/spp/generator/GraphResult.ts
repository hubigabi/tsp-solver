import {NodeRequest} from "../NodeRequest";
import {RoadTypeRequest} from "../RoadTypeRequest";
import {EdgeRequest} from "../EdgeRequest";

export class GraphResult {
  nodes: NodeRequest[];
  roadTypes: RoadTypeRequest[];
  edges: EdgeRequest[];

  constructor(nodes: NodeRequest[], roadTypes: RoadTypeRequest[], edges: EdgeRequest[]) {
    this.nodes = nodes;
    this.roadTypes = roadTypes;
    this.edges = edges;
  }

}
