import {Component, OnInit} from '@angular/core';
import * as cytoscape from 'cytoscape';

@Component({
  selector: 'app-graph-spp',
  templateUrl: './graph-spp.component.html',
  styleUrls: ['./graph-spp.component.css']
})
export class GraphSppComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
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
      }

    });
  }

}
