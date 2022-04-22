import {Component, OnInit} from '@angular/core';
import * as paper from 'paper';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {City} from "../model/City";
import {TspAlgorithmService} from "../service/tsp-algorithm.service";
import {RouteAlgorithmRow} from "./RouteAlgorithmRow";
import {Observable} from "rxjs";
import {RouteAlgorithm} from "../model/RouteAlgorithm";

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
  chosenAlgorithm = "0";

  simulatedAnnealingForm = this.fb.group({
    maxTemperature: [100.0, [Validators.required, Validators.min(1)]],
    minTemperature: [0.1, [Validators.required, Validators.min(0)]],
    coolingRate: [0.99, [Validators.required, Validators.min(0.0001), Validators.max(0.9999)]],
    epochs: [1000, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
  });

  geneticAlgorithmForm = this.fb.group({
    populationSize: [100, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
    elitismSize: [20, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]],
    mutationRate: [0.01, [Validators.required, Validators.min(0.0), Validators.max(1)]],
    epochs: [10000, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
  });

  antColonyOptimizationForm = this.fb.group({
    alpha: [1, [Validators.required, Validators.min(0)]],
    beta: [5, [Validators.required, Validators.min(0)]],
    evaporationRate: [0.5, [Validators.required, Validators.min(0.0), Validators.max(1)]],
    q: [500, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
    antFactor: [0.8, [Validators.required, Validators.min(0.1)]],
    randomCitySelection: [0.01, [Validators.required, Validators.min(0.0), Validators.max(1)]],
    iterations: [50, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
  });

  routeAlgorithmRows: RouteAlgorithmRow[] = [];
  idCounter = 0;

  constructor(private fb: FormBuilder, private tspAlgorithmService: TspAlgorithmService) {
  }

  ngOnInit(): void {
    this.simulatedAnnealingForm.setValidators(this.greaterThan('maxTemperature', 'minTemperature'));
    this.geneticAlgorithmForm.setValidators(this.greaterThan('populationSize', 'elitismSize'));
    paper.setup('canvas');
    this.cities = City.generateRandomCities(100, this.cityMaxX, this.cityMaxY);
    this.drawCities(this.cities)
  }

  greaterThan(field1Name: string, field2Name: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const field1 = control.get(field1Name);
      const field2 = control.get(field2Name);
      const notGreater = Number(field1!.value) <= Number(field2!.value);
      return notGreater ? {'notGreater': {value: field1!.value}} : null;
    }
  }

  generateCities() {
    this.cities = City.generateRandomCities(this.citiesNumber.value, this.cityMaxX, this.cityMaxY);
    this.drawCities(this.cities)
  }

  drawCities(cities: City[]) {
    const widthRate = paper.view.size.width / this.cityMaxX;
    const heightRate = paper.view.size.height / this.cityMaxY;

    paper.project.clear();
    for (let city of cities) {
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
  }

  runAlgorithm() {
    const routeAlgorithmRowId = this.idCounter++
    const routeAlgorithmRow: RouteAlgorithmRow = {
      id: routeAlgorithmRowId,
      algorithmType: '',
      parameters: '',
      calculationTime: 0,
      totalCost: 0,
      citiesOrder: [],
      completed: false
    };
    let routeAlgorithm!: Observable<RouteAlgorithm>;

    switch (this.chosenAlgorithm) {
      case '0': {
        routeAlgorithmRow.algorithmType = 'Nearest Neighbour';
        routeAlgorithm = this.tspAlgorithmService.getNearestNeighbour(this.cities);
        break;
      }
      case '1': {
        break;
      }
      default: {
        break;
      }
    }

    this.routeAlgorithmRows.push(routeAlgorithmRow);

    routeAlgorithm.subscribe(value => {
      let completedRouteAlgorithmRow = this.routeAlgorithmRows.find(e => e.id === routeAlgorithmRowId);

      if (completedRouteAlgorithmRow !== undefined) {
        completedRouteAlgorithmRow.totalCost = value.totalCost;
        completedRouteAlgorithmRow.calculationTime = value.calculationTime;
        completedRouteAlgorithmRow.citiesOrder = value.citiesOrder;
        completedRouteAlgorithmRow.completed = true;
      }
    })

  }

}
