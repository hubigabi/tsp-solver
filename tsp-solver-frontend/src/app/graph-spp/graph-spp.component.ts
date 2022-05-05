import {Component, OnInit} from '@angular/core';
import * as cytoscape from 'cytoscape';
import {EdgeSingular, ElementDefinition} from 'cytoscape';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {RoadType} from "./RoadType";
import {Edge} from "./Edge";
import {NodeRequest} from '../model/request/spp/NodeRequest';
import {RoadTypeRequest} from "../model/request/spp/RoadTypeRequest";
import {PathRequirement} from "../model/request/spp/PathRequirement";
import {SppRequest} from "../model/request/spp/SppRequest";
import {EdgeRequest} from "../model/request/spp/EdgeRequest";
import {SppService} from "../service/spp.service";
import {Route} from "../model/request/spp/Route";
import {AlgorithmRun} from "../algorithm-form/AlgorithmRun";
import {RouteAlgorithmRow} from "../tsp-algorithms/RouteAlgorithmRow";
import {RequestStatus} from "../tsp-algorithms/RequestStatus";
import {NotificationsService} from "angular2-notifications";
import {GraphRequest} from '../model/request/spp/generator/GraphRequest';

// declare var require: any
// const automove = require('cytoscape-automove');

@Component({
  selector: 'app-graph-spp',
  templateUrl: './graph-spp.component.html',
  styleUrls: ['./graph-spp.component.css']
})
export class GraphSppComponent implements OnInit {

  roadTypes: RoadType[] = [];
  isRoadTypesCollapsed = false;
  cy!: cytoscape.Core;
  newCityName = new FormControl('', [Validators.required, this.noWhitespaceValidator]);

  nodesNumber = new FormControl(50, Validators.required);

  roadTypeForm = this.fb.group({
    type: ['', [Validators.required, this.noWhitespaceValidator]],
    weight: [1.0, [Validators.required, Validators.min(0.1), Validators.max(10)]],
    color: [this.getRandomColor(), [Validators.required]],
  });

  edgeForm = this.fb.group({
    source: [{value: '', disabled: true}, [Validators.required]],
    target: ['', [Validators.required]],
    roadType: ['', [Validators.required]],
    distance: [10.0, [Validators.required, Validators.min(0.01)]],
    capacity: [10.0, [Validators.required, Validators.min(0.01)]],
  });

  findRoutesForm = this.fb.group({
    startingCity: ['', Validators.required],
    bearingCapacity: [10.0, [Validators.required, Validators.min(0.01)]],
  });

  selectedRoadTypeId = -1;
  allNodesId: string[] = []
  selectedNodeId = '';
  selectedNodeEdges: Edge[] = [];
  selectedEdgeId = '';

  routesMatrix: Route[][] = [];
  costMatrix: number[][] = [];

  idCounter = 0;
  routeAlgorithmRows: RouteAlgorithmRow[] = [];

  isPathShown = false;
  options = {
    preventDuplicates: true
  };

  constructor(private fb: FormBuilder, private sppService: SppService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    // if (typeof cytoscape('core', 'automove') !== 'function') {
      // cytoscape.use(automove);
    // }

    this.roadTypes = RoadType.getDefault();
    this.clearRoadTypeForm();
    this.clearEdgeForm();

    this.cy = cytoscape({
      container: document.getElementById('cy'),

      elements: [
        {
          data: {id: 'A'}
        },
        {
          data: {id: 'B'}
        },
        {
          data: {id: 'C'}
        },
        {
          data: {id: 'D'}
        },
        {
          data: {id: 'E'}
        },
        {
          data: {
            id: 'AB', source: 'A', target: 'B', distance: 15, roadType: this.roadTypes[0],
            bearingCapacity: 30, color: this.roadTypes[0].color
          }
        },
        {
          data: {
            id: 'BC', source: 'B', target: 'C', distance: 20, roadType: this.roadTypes[0],
            bearingCapacity: 25, color: this.roadTypes[0].color
          },
        },
        {
          data: {
            id: 'CD', source: 'C', target: 'D', distance: 20, roadType: this.roadTypes[0],
            bearingCapacity: 25, color: this.roadTypes[0].color
          }
        },
        {
          data: {
            id: 'DE', source: 'D', target: 'E', distance: 20, roadType: this.roadTypes[0],
            bearingCapacity: 25, color: this.roadTypes[0].color
          }
        }, {
          data: {
            id: 'EA', source: 'E', target: 'A', distance: 20, roadType: this.roadTypes[0],
            bearingCapacity: 25, color: this.roadTypes[0].color
          }
        }
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#888',
            'width': 20,
            'height': 20,
            'label': 'data(id)',
            "font-size": 10
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': 'data(color)',
            'target-arrow-color': '#333',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': (e: any) => Math.round((e.data("distance") + Number.EPSILON) * 100) / 100 + '',
            'font-size': 10,
            'text-rotation': 'autorotate',
          }
        },
      ],
      layout: {
        name: 'cose',
        animate: false,
      },
      minZoom: 0.6,
      maxZoom: 3,
    });

    // (this.cy as any).automove({
    //   nodesMatching: (node: any) => true,
    //   reposition: 'viewport'
    // });

    this.cy.on('tap', event => {
      if (event.target.isNode?.()) {
        const node = event.target;
        this.selectedNodeId = node.id();
        this.selectedNodeEdges = event.target.connectedEdges()
          .filter((edge: EdgeSingular) => edge.data().source == this.selectedNodeId)
          .map((edge: EdgeSingular) => {
            let data = edge.data();
            const color = this.getRoadTypeColor(data.roadType);
            return new Edge(data.id, data.source, data.target, data.distance, data.roadType, data.bearingCapacity, color);
          });
        this.edgeForm.get('source')!.setValue(this.selectedNodeId);

        let target = this.allNodesId.find(value => value != this.selectedNodeId);
        this.edgeForm.get('target')!.setValue(target);
      } else {
        this.selectedNodeId = ''
        this.selectedNodeEdges = [];
      }
    });

    this.allNodesId = this.cy.nodes().map(e => e.id());
    this.findRoutesForm.get('startingCity')!.setValue(this.allNodesId.length > 0 ? this.allNodesId[0] : '');
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {'whitespace': true};
  }

  addCity() {
    const id = this.newCityName.value;
    const nodesIdLength = this.cy.filter(`node[id = "${id}"]`).length
    if (nodesIdLength == 0) {
      this.cy.add({
        group: 'nodes',
        position: {x: this.cy.extent().x1 + 30, y: this.cy.extent().y1 + 30},
        data: {id: id},
      });
      this.allNodesId.push(id);
      this.newCityName.setValue('');
    } else {
      alert("Node with this name already exists");
    }
  }

  deleteRoadType(roadType: RoadType) {
    let index = this.roadTypes.findIndex(value => value.id == roadType.id);
    if (index > -1) {
      this.roadTypes.splice(index, 1);
      if (this.selectedRoadTypeId == roadType.id) {
        this.selectedRoadTypeId = -1;
      }

      if (this.edgeForm.get('roadType')!.value.id == roadType.id) {
        this.edgeForm.get('roadType')!.setValue(this.roadTypes.length > 0 ? this.roadTypes[0] : '');
      }
    }

    this.cy.remove(`edge[roadType.id = ${roadType.id}]`)
    this.selectedNodeEdges = this.selectedNodeEdges.filter(value => value.roadType.id != roadType.id);
  }

  addRoadType() {
    let id = 1;
    if (this.roadTypes.length > 0) {
      id = Math.max.apply(Math, this.roadTypes.map(value => value.id)) + 1
    }

    const type = this.roadTypeForm.get('type')!.value;
    const weight = this.roadTypeForm.get('weight')!.value;
    const color = this.roadTypeForm.get('color')!.value;

    let roadType = new RoadType(id, type, weight, color);
    this.roadTypes.push(roadType);
    this.selectedRoadTypeId = -1;
    this.clearRoadTypeForm();
  }

  editRoadType() {
    const type = this.roadTypeForm.get('type')!.value;
    const weight = this.roadTypeForm.get('weight')!.value;
    const color = this.roadTypeForm.get('color')!.value;

    let selectedRoadType = this.roadTypes.find(value => value.id == this.selectedRoadTypeId);

    if (selectedRoadType !== undefined) {
      selectedRoadType.type = type;
      selectedRoadType.weight = weight;
      selectedRoadType.color = color;
    }

    this.cy.edges(`[roadType.id = ${selectedRoadType?.id}]`)
      .map(edge => {
        edge.style({'line-color': color});
        return edge;
      });

    this.selectedRoadTypeId = -1;
    this.clearRoadTypeForm();
  }

  clearRoadTypeForm() {
    this.roadTypeForm.get('type')!.setValue('');
    this.roadTypeForm.get('weight')!.setValue('1.0');
    this.roadTypeForm.get('color')!.setValue(this.getRandomColor());
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  selectEditingRoadType(roadType: RoadType) {
    this.selectedRoadTypeId = roadType.id;
    this.roadTypeForm.get('type')!.setValue(roadType.type);
    this.roadTypeForm.get('weight')!.setValue(roadType.weight);
    this.roadTypeForm.get('color')!.setValue(roadType.color);
  }

  deleteEdge(edge: Edge) {
    this.cy.remove(`edge[id = "${edge.id}"]`)

    let index = this.selectedNodeEdges.findIndex(value => value.id == edge.id);
    if (index > -1) {
      this.selectedNodeEdges.splice(index, 1);
      if (this.selectedEdgeId == edge.id) {
        this.selectedEdgeId = '';
      }
    }
  }

  selectEditingEdge(edge: Edge) {
    this.selectedEdgeId = edge.id;
    this.edgeForm.get('target')!.setValue(edge.target);
    this.edgeForm.get('roadType')!.setValue(edge.roadType);
    this.edgeForm.get('distance')!.setValue(edge.distance);
    this.edgeForm.get('capacity')!.setValue(edge.bearingCapacity);
  }

  addEdge() {
    const source = this.edgeForm.get('source')!.value;
    const target = this.edgeForm.get('target')!.value;
    const roadType = this.edgeForm.get('roadType')!.value;
    const distance = this.edgeForm.get('distance')!.value;
    const capacity = this.edgeForm.get('capacity')!.value;
    const id = source + target + '-' + this.generateId();
    const color = this.getRoadTypeColor(roadType);
    let edge = new Edge(id, source, target, distance, roadType, capacity, color);

    this.cy.add({
      group: 'edges',
      data: {
        id: id, source: source, target: target, roadType: roadType,
        distance: distance, bearingCapacity: capacity, color: color
      },
    });
    this.selectedNodeEdges.push(edge);

    this.selectedEdgeId = '';
    this.clearEdgeForm();
  }

  editEdge() {
    const source = this.edgeForm.get('source')!.value;
    const target = this.edgeForm.get('target')!.value;
    const roadType = this.edgeForm.get('roadType')!.value;
    const distance = this.edgeForm.get('distance')!.value;
    const capacity = this.edgeForm.get('capacity')!.value;
    const color = this.getRoadTypeColor(roadType);

    let selectedEdgeId = this.selectedNodeEdges.findIndex(value => value.id == this.selectedEdgeId);
    if (selectedEdgeId > -1) {
      this.selectedNodeEdges[selectedEdgeId] = new Edge(this.selectedEdgeId, source, target, distance, roadType, capacity, color);
    }
    const edgeCy = this.cy.$(`edge[id = "${this.selectedEdgeId}"]`);
    edgeCy.data({
      source: source,
      target: target,
      roadType: roadType,
      distance: distance,
      bearingCapacity: capacity,
      color: color
    });

    this.selectedEdgeId = '';
    this.clearEdgeForm();
  }

  clearEdgeForm() {
    this.edgeForm.get('distance')!.setValue(10.0);
    this.edgeForm.get('capacity')!.setValue(10.0);
    this.edgeForm.get('roadType')!.setValue(this.roadTypes.length > 0 ? this.roadTypes[0] : '');
  }

  generateId(): string {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  getRoadTypeColor(roadType: RoadType): string {
    let road = this.roadTypes.find(value => value.id === roadType.id);
    if (road != undefined) {
      return road.color;
    }
    return this.getRandomColor();
  }

  deleteCity() {
    this.cy.remove(`node[id = "${this.selectedNodeId}"]`)

    const index = this.allNodesId.findIndex(value => value == this.selectedNodeId);
    if (index > -1) {
      this.allNodesId.splice(index, 1);
    }
    this.selectedNodeEdges = this.selectedNodeEdges.filter(value =>
      value.source != this.selectedEdgeId && value.target != this.selectedEdgeId);

    if (this.findRoutesForm.get('startingCity')!.value === this.selectedNodeId) {
      this.findRoutesForm.get('startingCity')!.setValue(this.allNodesId.length > 0 ? this.allNodesId[0] : '');
    }
    this.selectedEdgeId = ''
    this.selectedNodeId = '';
  }

  findRoutes() {
    const nodesRequest = this.cy.nodes().map(e => new NodeRequest(e.id()));
    let startingCityIndex = nodesRequest.findIndex(value => value.id === this.findRoutesForm.get('startingCity')!.value)
    if (startingCityIndex > -1) {
      // Move starting city to the begging of array
      const element = nodesRequest[startingCityIndex];
      nodesRequest.splice(startingCityIndex, 1);
      nodesRequest.splice(0, 0, element);
    } else {
      alert("Starting city does not exist");
    }

    const roadTypesRequest = this.roadTypes.map(roadType => new RoadTypeRequest(roadType.id, roadType.type, roadType.weight));
    let edgesRequest = this.cy.edges().map((edge: EdgeSingular) => {
      let data = edge.data();
      return new EdgeRequest(data.id, data.source, data.target, data.distance, data.roadType.id, data.bearingCapacity);
    });
    const bearingCapacity = this.findRoutesForm.get('bearingCapacity')!.value;
    const pathRequirement = new PathRequirement(bearingCapacity);

    const sppRequest = new SppRequest(nodesRequest, roadTypesRequest, edgesRequest, pathRequirement);
    console.log(sppRequest);
    this.sppService.getSppResult(sppRequest)
      .subscribe({
        next: value => {
          this.routesMatrix = value.routesMatrix;
          this.costMatrix = this.getCostMatrix(this.routesMatrix);
          console.log(this.costMatrix);
        },
        error: value => {
          console.log(value);
        }
      });
    this.routeAlgorithmRows = [];
  }

  getCostMatrix(routesMatrix: Route[][]): number[][] {
    const costMatrix: number[][] = [];
    for (let i = 0; i < routesMatrix.length; i++) {
      costMatrix[i] = [];
      for (let j = 0; j < routesMatrix[i].length; j++) {
        costMatrix[i][j] = routesMatrix[i][j].cost;
      }
    }
    return costMatrix;
  }

  onRunAlgorithm(algorithmRun: AlgorithmRun) {
    const routeAlgorithmRowId = this.idCounter++
    let routeAlgorithmRow = algorithmRun.routeAlgorithmRow;
    routeAlgorithmRow.id = routeAlgorithmRowId;
    this.routeAlgorithmRows.push(routeAlgorithmRow);

    algorithmRun.routeAlgorithmObservable.subscribe({
      next: value => {
        let completedRouteAlgorithmRow = this.routeAlgorithmRows.find(e => e.id === routeAlgorithmRowId);

        if (completedRouteAlgorithmRow !== undefined) {
          completedRouteAlgorithmRow.totalCost = value.totalCost;
          completedRouteAlgorithmRow.calculationTime = value.calculationTime;
          completedRouteAlgorithmRow.citiesOrder = value.citiesOrder;
          completedRouteAlgorithmRow.status = RequestStatus.SUCCESS;
        }
      },
      error: value => {
        let completedRouteAlgorithmRow = this.routeAlgorithmRows.find(e => e.id === routeAlgorithmRowId);

        if (completedRouteAlgorithmRow !== undefined) {
          completedRouteAlgorithmRow.status = RequestStatus.FAILURE;
        }
      }
    });
  }

  onRouteMatrixClick(route: Route) {
    console.log(route);

    this.cy.edges().map(edge => {
      let id = edge.data().id;

      if (route.edgesPath.includes(id)) {
        edge.style({'opacity': 1.0});
      } else {
        edge.style({'opacity': 0.1});
      }

      return edge
    });

    this.cy.nodes().map(node => {
      let id = node.data().id;

      if (route.nodesPath.includes(id) || route.from === id || route.to === id) {
        node.style({'opacity': 1.0});
      } else {
        node.style({'opacity': 0.1});
      }

      return node
    });
    this.setPathShown()
  }

  onCitiesOrderClick(citiesOrder: number[]) {
    const citiesIdOrder = citiesOrder.map(cityId => this.routesMatrix[cityId][0].from);

    let edgesPath: number[] = []
    for (let i = 0; i < citiesOrder.length - 1; i++) {
      edgesPath = edgesPath.concat(this.routesMatrix[citiesOrder[i]][citiesOrder[i + 1]].edgesPath);
    }

    console.log(citiesIdOrder);
    console.log(edgesPath);

    this.cy.nodes().map(node => {
      node.style({'opacity': 1.0});
      return node
    });

    this.cy.edges().map(edge => {
      let id = edge.data().id;

      if (edgesPath.includes(id)) {
        edge.style({'opacity': 1.0});
      } else {
        edge.style({'opacity': 0.1});
      }

      return edge
    });
    this.setPathShown()
  }

  setPathShown() {
    this.isPathShown = true;
    this.notificationsService.warn('Path is shown',
      'Click here to restore view', {
        clickToClose: true
      }).click?.subscribe((event) => {
      this.cy.nodes().map(node => {
        node.style({'opacity': 1.0});
        return node
      });
      this.cy.edges().map(node => {
        node.style({'opacity': 1.0});
        return node
      });
      this.isPathShown = false;
    });
  }

  generateGraph() {
    this.sppService.generateGraph(new GraphRequest(this.nodesNumber.value))
      .subscribe({
        next: graphResult => {
          console.log(graphResult);

          this.roadTypes = graphResult.roadTypes
            .map(value => new RoadType(value.id, value.type, value.weight, this.getRandomColor()));
          this.allNodesId = graphResult.nodes.map(value => value.id);

          this.cy.remove('edge');
          this.cy.remove('node');

          let nodes: ElementDefinition[] = graphResult.nodes.map(node => {
            return {
              group: 'nodes',
              data: {id: node.id}
            };
          });
          this.cy.add(nodes);

          let edges: ElementDefinition[] = graphResult.edges.map(edge => {
            let roadType = this.roadTypes.find(value => value.id === edge.roadTypeId);
            return {
              group: 'edges',
              data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                distance: edge.distance,
                roadType: roadType,
                bearingCapacity: edge.bearingCapacity,
                color: roadType?.color
              }
            };
          });
          this.cy.add(edges);

          const layout = this.cy.layout({
            name: 'cose',
            animate: false,
            nodeOverlap: 40,
            idealEdgeLength: function( edge ){ return 100; },
          });
          layout.run();

          this.selectedRoadTypeId = -1;
          this.selectedNodeId = '';
          this.selectedNodeEdges = [];
          this.selectedEdgeId = '';
          this.routesMatrix = [];
          this.costMatrix = [];
          this.routeAlgorithmRows = [];
        },
        error: value => {
          console.log(value);
        }
      });
  }
}
