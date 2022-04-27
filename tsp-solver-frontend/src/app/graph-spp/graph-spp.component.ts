import {Component, OnInit} from '@angular/core';
import * as cytoscape from 'cytoscape';
import {FormControl, Validators} from "@angular/forms";
import {RoadType} from "./RoadType";

declare var require: any
const automove = require('cytoscape-automove');

@Component({
  selector: 'app-graph-spp',
  templateUrl: './graph-spp.component.html',
  styleUrls: ['./graph-spp.component.css']
})
export class GraphSppComponent implements OnInit {

  roadTypes: RoadType[] = [];
  cy!: cytoscape.Core;
  newCityName = new FormControl('', [Validators.required, this.noWhitespaceValidator]);

  constructor() {
  }

  ngOnInit(): void {
    this.roadTypes = RoadType.getDefault();
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
          data: {id: 'AB', source: 'A', target: 'B'}
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
      this.roadTypes.splice(index, 1);
    }
  }

}
