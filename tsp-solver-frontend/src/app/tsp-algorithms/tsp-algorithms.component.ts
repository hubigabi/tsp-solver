import {Component, OnInit} from '@angular/core';
import * as paper from 'paper';
import {FormControl, Validators} from "@angular/forms";
import {City} from "../model/City";
import {RouteAlgorithmRow} from "./RouteAlgorithmRow";
import {RequestStatus} from "./RequestStatus";
import {AlgorithmRun} from "../algorithm-form/AlgorithmRun";

@Component({
  selector: 'app-tsp-algorithms',
  templateUrl: './tsp-algorithms.component.html',
  styleUrls: ['./tsp-algorithms.component.css']
})
export class TspAlgorithmsComponent implements OnInit {

  readonly cityMaxX = 100;
  readonly cityMaxY = 100;

  citiesNumber = new FormControl(100, Validators.required);
  cities: City[] = []
  costMatrix: number[][] = [];

  idCounter = 0;
  routeAlgorithmRows: RouteAlgorithmRow[] = [];
  requestStatuses = RequestStatus;
  tableAscSortOrder = true;

  constructor() {
  }

  ngOnInit(): void {
    paper.setup('canvas');
    this.cities = City.generateRandomCities(100, this.cityMaxX, this.cityMaxY);
    this.costMatrix = City.toCostMatrix(this.cities);
    this.drawCities(this.cities)
  }

  generateCities() {
    this.routeAlgorithmRows = [];
    this.cities = City.generateRandomCities(this.citiesNumber.value, this.cityMaxX, this.cityMaxY);
    this.costMatrix = City.toCostMatrix(this.cities);
    this.drawCities(this.cities)
  }

  drawCity(city: City, widthRate: number, heightRate: number) {
    let cityCircle = new paper.Path.Circle({
      center: new paper.Point(city.x * widthRate, city.y * heightRate),
      radius: 3,
      fillColor: 'black',
    });
    const group = new paper.Group();
    group.addChild(cityCircle);

    cityCircle.onMouseEnter = function (event: MouseEvent) {
      const pointText = new paper.PointText(new paper.Point(this.position.x, this.position.y - 12));
      pointText.justification = 'center';
      pointText.fontSize = 16;
      pointText.fillColor = new paper.Color('white');
      pointText.strokeColor = new paper.Color('gray');
      pointText.content = 'City: ' + city.id;
      pointText.name = 'tooltip';
      this.parent.addChild(pointText);
    }

    cityCircle.onMouseLeave = function (event: MouseEvent) {
      let index = this.parent.children.findIndex(value => value.name === 'tooltip');
      this.parent.children[index].remove();
    }
  }

  drawCities(cities: City[]) {
    const widthRate = paper.view.size.width / this.cityMaxX;
    const heightRate = paper.view.size.height / this.cityMaxY;

    paper.project.clear();
    for (let city of cities) {
      this.drawCity(city, widthRate, heightRate);
    }
    this.highlightStartingCity(widthRate, heightRate);
  }

  drawCitiesOrder(citiesOrder: number[]) {
    const widthRate = paper.view.size.width / this.cityMaxX;
    const heightRate = paper.view.size.height / this.cityMaxY;
    paper.project.clear();

    for (let i = 0; i < citiesOrder.length - 1; i++) {
      const city = this.cities[citiesOrder[i]];
      this.drawCity(city, widthRate, heightRate);

      const from = new paper.Point(city.x * widthRate, city.y * heightRate);
      const to = new paper.Point(this.cities[citiesOrder[i + 1]].x * widthRate, this.cities[citiesOrder[i + 1]].y * heightRate);
      const path = new paper.Path.Line(from, to);
      path.strokeColor = new paper.Color('blue');
    }

    this.highlightStartingCity(widthRate, heightRate)
  }

  private highlightStartingCity(widthRate: number, heightRate: number) {
    const startingCity = this.cities[0];
    const path = new paper.Path.Circle(new paper.Point(startingCity.x * widthRate, startingCity.y * heightRate), 10);
    path.strokeColor = new paper.Color('red');
  }

  sortTable(colName: keyof RouteAlgorithmRow) {
    if (this.tableAscSortOrder) {
      this.routeAlgorithmRows.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
    } else {
      this.routeAlgorithmRows.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
    }
    this.tableAscSortOrder = !this.tableAscSortOrder
  }

  onRunAlgorithm($event: AlgorithmRun) {
    const routeAlgorithmRowId = this.idCounter++
    let routeAlgorithmRow = $event.routeAlgorithmRow;
    routeAlgorithmRow.id = routeAlgorithmRowId;
    this.routeAlgorithmRows.push(routeAlgorithmRow);

    $event.routeAlgorithmObservable.subscribe({
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

}
