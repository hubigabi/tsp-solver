import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RequestStatus} from "../tsp-algorithms/RequestStatus";
import {RouteAlgorithmRow} from "../tsp-algorithms/RouteAlgorithmRow";

@Component({
  selector: 'app-route-algorithm-table',
  templateUrl: './route-algorithm-table.component.html',
  styleUrls: ['./route-algorithm-table.component.css']
})
export class RouteAlgorithmTableComponent implements OnInit {

  @Input() routeAlgorithmRows: RouteAlgorithmRow[] = [];
  @Output() routeOrderClickEmitter = new EventEmitter<number[]>();

  requestStatuses = RequestStatus;
  tableAscSortOrder = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  sortTable(colName: keyof RouteAlgorithmRow) {
    if (this.tableAscSortOrder) {
      this.routeAlgorithmRows.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
    } else {
      this.routeAlgorithmRows.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
    }
    this.tableAscSortOrder = !this.tableAscSortOrder
  }

  onRouteOrderClick(citiesOrder: number[]) {
    this.routeOrderClickEmitter.emit(citiesOrder);
  }

}
