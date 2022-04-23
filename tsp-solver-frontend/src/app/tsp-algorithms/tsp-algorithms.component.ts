import {Component, OnInit} from '@angular/core';
import * as paper from 'paper';
import {AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {City} from "../model/City";
import {TspAlgorithmService} from "../service/tsp-algorithm.service";
import {RouteAlgorithmRow} from "./RouteAlgorithmRow";
import {Observable} from "rxjs";
import {RouteAlgorithm} from "../model/RouteAlgorithm";
import {SimulatedAnnealingRequest} from "../model/request/SimulatedAnnealingRequest";
import {GeneticAlgorithmRequest} from "../model/request/GeneticAlgorithmRequest";
import {AntColonyRequest} from "../model/request/AntColonyRequest";
import {RequestStatus} from "./RequestStatus";

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
    epochs: [1000, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
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
  requestStatuses = RequestStatus;
  tableAscSortOrder = true;

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
    this.routeAlgorithmRows = [];
    this.cities = City.generateRandomCities(this.citiesNumber.value, this.cityMaxX, this.cityMaxY);
    this.drawCities(this.cities)
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
      status: RequestStatus.ONGOING
    };
    let routeAlgorithm!: Observable<RouteAlgorithm>;

    switch (this.chosenAlgorithm) {
      case '0': {
        routeAlgorithmRow.algorithmType = 'Nearest neighbour';
        routeAlgorithm = this.tspAlgorithmService.getNearestNeighbour(this.cities);
        break;
      }
      case '1': {
        routeAlgorithmRow.algorithmType = '2-opt';
        routeAlgorithm = this.tspAlgorithmService.getTwoOpt(this.cities);
        break;
      }
      case '2': {
        const maxTemperature = this.simulatedAnnealingForm.get('maxTemperature')!.value;
        const minTemperature = this.simulatedAnnealingForm.get('minTemperature')!.value;
        const coolingRate = this.simulatedAnnealingForm.get('coolingRate')!.value;
        const epochs = this.simulatedAnnealingForm.get('epochs')!.value;

        routeAlgorithmRow.algorithmType = 'Simulated annealing';
        routeAlgorithmRow.parameters = `Max temperature = ${maxTemperature}, `
          + `Min  temperature = ${minTemperature}, `
          + `Cooling rate = ${coolingRate}, `
          + `Epochs = ${epochs}`;

        const simulatedAnnealingRequest = new SimulatedAnnealingRequest(this.cities,
          maxTemperature, minTemperature, coolingRate, epochs);
        routeAlgorithm = this.tspAlgorithmService.getSimulatedAnnealing(simulatedAnnealingRequest);
        break;
      }
      case '3': {
        const populationSize = this.geneticAlgorithmForm.get('populationSize')!.value;
        const elitismSize = this.geneticAlgorithmForm.get('elitismSize')!.value;
        const mutationRate = this.geneticAlgorithmForm.get('mutationRate')!.value;
        const epochs = this.geneticAlgorithmForm.get('epochs')!.value;

        routeAlgorithmRow.algorithmType = 'Genetic algorithm';
        routeAlgorithmRow.parameters = `Population size = ${populationSize}, `
          + `Elitism  size = ${elitismSize}, `
          + `Mutation rate = ${mutationRate}, `
          + `Epochs = ${epochs}`;

        const geneticAlgorithmRequest = new GeneticAlgorithmRequest(this.cities,
          populationSize, elitismSize, mutationRate, epochs);
        routeAlgorithm = this.tspAlgorithmService.getGeneticAlgorithm(geneticAlgorithmRequest);
        break;
      }
      case '4': {
        const alpha = this.antColonyOptimizationForm.get('alpha')!.value;
        const beta = this.antColonyOptimizationForm.get('beta')!.value;
        const evaporationRate = this.antColonyOptimizationForm.get('evaporationRate')!.value;
        const q = this.antColonyOptimizationForm.get('q')!.value;
        const antFactor = this.antColonyOptimizationForm.get('antFactor')!.value;
        const randomCitySelection = this.antColonyOptimizationForm.get('randomCitySelection')!.value;
        const iterations = this.antColonyOptimizationForm.get('iterations')!.value;

        routeAlgorithmRow.algorithmType = 'Ant colony optimization';
        routeAlgorithmRow.parameters = `α = ${alpha}, `
          + `β = ${beta}, `
          + `Evaporation = ${evaporationRate}, `
          + `Q = ${q}, `
          + `Ant factor = ${antFactor}, `
          + `Random selection = ${randomCitySelection}, `
          + `Iterations = ${iterations}`;

        const antColonyRequest = new AntColonyRequest(this.cities,
          alpha, beta, evaporationRate, q, antFactor, randomCitySelection, iterations);
        routeAlgorithm = this.tspAlgorithmService.getAntColonyOptimization(antColonyRequest);
        break;
      }
      default: {
        break;
      }
    }
    this.routeAlgorithmRows.push(routeAlgorithmRow);

    routeAlgorithm.subscribe({
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

}
