import {Component, OnInit} from '@angular/core';
import * as cytoscape from 'cytoscape';

declare var require: any
const automove = require('cytoscape-automove');

@Component({
  selector: 'app-graph-spp',
  templateUrl: './graph-spp.component.html',
  styleUrls: ['./graph-spp.component.css']
})
export class GraphSppComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    cytoscape.use(automove);

    const cy = cytoscape({
      container: document.getElementById('cy'),

      elements: [
        {
          data: {id: 'a'}
        },
        {
          data: {id: 'b'}
        },
        {
          data: {id: 'ab', source: 'a', target: 'b'}
        }
      ],

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      },

      minZoom: 0.6,
      maxZoom: 3,
    });

    (cy as any).automove({
      nodesMatching: (node: any) => true,
      reposition: 'viewport'
    });

  }

}
