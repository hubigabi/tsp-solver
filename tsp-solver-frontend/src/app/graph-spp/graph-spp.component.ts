import {Component, OnInit} from '@angular/core';
import * as cytoscape from 'cytoscape';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {RoadType} from "./RoadType";
import {EdgeSingular} from "cytoscape";
import {Edge} from "./Edge";

declare var require: any
const automove = require('cytoscape-automove');

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

  roadTypeForm = this.fb.group({
    type: ['', [Validators.required, this.noWhitespaceValidator]],
    weight: [1.0, [Validators.required, Validators.min(0.1), Validators.max(10)]],
    color: [this.getRandomColor(), [Validators.required]],
  });

  selectedRoadTypeId = -1;
  selectedNodeId = '';
  selectedNodeEdges: Edge[] = [];
  selectedEdgeId = '';

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.roadTypes = RoadType.getDefault();
    this.clearRoadTypeForm();
    cytoscape.use(automove);

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
          data: {id: 'AB', source: 'A', target: 'B', distance: 15, roadType: this.roadTypes[0], bearingCapacity: 30}
        },
        {
          data: {id: 'BA', source: 'B', target: 'A', distance: 20, roadType: this.roadTypes[1], bearingCapacity: 25}
        }
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
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
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: false,
      },
      minZoom: 0.6,
      maxZoom: 3,
    });

    (this.cy as any).automove({
      nodesMatching: (node: any) => true,
      reposition: 'viewport'
    });

    this.cy.on('tap', 'node', event => {
      const node = event.target;
      this.selectedNodeId = node.id();
      this.selectedNodeEdges = event.target.connectedEdges().map((edge: EdgeSingular) => {
        let data = edge.data();
        return new Edge(data.id, data.source, data.target, data.distance, data.roadType, data.bearingCapacity);
      });
    });

  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {'whitespace': true};
  }

  addCity() {
    const name = this.newCityName.value;
    const nodesIdLength = this.cy.filter(`node[id = "${name}"]`).length
    if (nodesIdLength == 0) {
      this.cy.add({
        group: 'nodes',
        position: {x: this.cy.extent().x1 + 30, y: this.cy.extent().y1 + 30},
        data: {id: name, weight: 75},
      });
    } else {
      alert("Node with this name already exists");
      this.newCityName.setValue('');
    }
  }

  deleteRoadType(roadType: RoadType) {
    let index = this.roadTypes.findIndex(value => value.id == roadType.id);
    if (index > -1) {
      if (this.roadTypes[index].id == this.selectedRoadTypeId) {
        this.selectedRoadTypeId = -1;
      }

      this.roadTypes.splice(index, 1);
    }
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

    let selectedRoadTypes = this.roadTypes.find(value => value.id == this.selectedRoadTypeId);

    if (selectedRoadTypes !== undefined) {
      selectedRoadTypes.type = type;
      selectedRoadTypes.weight = weight;
      selectedRoadTypes.color = color;
    }
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
  }

  selectEditingEdge(edge: Edge) {
    this.selectedEdgeId = edge.id;
  }

}
