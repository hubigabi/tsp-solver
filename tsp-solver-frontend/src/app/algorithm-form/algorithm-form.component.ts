import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {RouteAlgorithmRow} from "../tsp-algorithms/RouteAlgorithmRow";
import {RequestStatus} from "../tsp-algorithms/RequestStatus";
import {Observable} from "rxjs";
import {RouteAlgorithm} from "../model/RouteAlgorithm";
import {SimulatedAnnealingRequest} from "../model/request/tsp/SimulatedAnnealingRequest";
import {GeneticAlgorithmRequest} from "../model/request/tsp/GeneticAlgorithmRequest";
import {AntColonyRequest} from "../model/request/tsp/AntColonyRequest";
import {AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {TspAlgorithmService} from "../service/tsp-algorithm.service";
import {AlgorithmRun} from "./AlgorithmRun";

@Component({
  selector: 'app-algorithm-form',
  templateUrl: './algorithm-form.component.html',
  styleUrls: ['./algorithm-form.component.css']
})
export class AlgorithmFormComponent implements OnInit {

  @Input() costMatrix: number[][] = [];
  @Output() runAlgorithmEmitter = new EventEmitter<AlgorithmRun>();
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

  constructor(private fb: FormBuilder, private tspAlgorithmService: TspAlgorithmService) {
  }

  ngOnInit(): void {
    this.simulatedAnnealingForm.setValidators(this.greaterThan('maxTemperature', 'minTemperature'));
    this.geneticAlgorithmForm.setValidators(this.greaterThan('populationSize', 'elitismSize'));
  }

  greaterThan(field1Name: string, field2Name: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const field1 = control.get(field1Name);
      const field2 = control.get(field2Name);
      const notGreater = Number(field1!.value) <= Number(field2!.value);
      return notGreater ? {'notGreater': {value: field1!.value}} : null;
    }
  }

  runAlgorithm() {
    const routeAlgorithmRow: RouteAlgorithmRow = {
      id: 0,
      algorithmType: '',
      parametersTranslation: '',
      parameters: {},
      calculationTime: 0,
      totalCost: 0,
      citiesOrder: [],
      status: RequestStatus.ONGOING
    };
    let routeAlgorithm!: Observable<RouteAlgorithm>;

    switch (this.chosenAlgorithm) {
      case '0': {
        routeAlgorithmRow.algorithmType = 'Nearest neighbour';
        routeAlgorithm = this.tspAlgorithmService.getNearestNeighbour(this.costMatrix);
        break;
      }
      case '1': {
        routeAlgorithmRow.algorithmType = '2-opt';
        routeAlgorithm = this.tspAlgorithmService.getTwoOpt(this.costMatrix);
        break;
      }
      case '2': {
        const maxTemperature = this.simulatedAnnealingForm.get('maxTemperature')!.value;
        const minTemperature = this.simulatedAnnealingForm.get('minTemperature')!.value;
        const coolingRate = this.simulatedAnnealingForm.get('coolingRate')!.value;
        const epochs = this.simulatedAnnealingForm.get('epochs')!.value;

        routeAlgorithmRow.algorithmType = 'Simulated annealing';
        routeAlgorithmRow.parametersTranslation = 'SimulatedAnnealingParameters';
        routeAlgorithmRow.parameters = {
          maxTemperature: maxTemperature,
          minTemperature: minTemperature,
          coolingRate: coolingRate,
          epochs: epochs
        };

        const simulatedAnnealingRequest = new SimulatedAnnealingRequest(this.costMatrix,
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
        routeAlgorithmRow.parametersTranslation = 'GeneticAlgorithmParameters';
        routeAlgorithmRow.parameters = {
          populationSize: populationSize,
          elitismSize: elitismSize,
          mutationRate: mutationRate,
          epochs: epochs
        };

        const geneticAlgorithmRequest = new GeneticAlgorithmRequest(this.costMatrix,
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
        routeAlgorithmRow.parametersTranslation = 'AntColonyOptimizationParameters';
        routeAlgorithmRow.parameters = {
          alpha: alpha,
          beta: beta,
          evaporationRate: evaporationRate,
          q: q,
          antFactor: antFactor,
          randomCitySelection: randomCitySelection,
          iterations: iterations
        };

        const antColonyRequest = new AntColonyRequest(this.costMatrix,
          alpha, beta, evaporationRate, q, antFactor, randomCitySelection, iterations);
        routeAlgorithm = this.tspAlgorithmService.getAntColonyOptimization(antColonyRequest);
        break;
      }
      default: {
        break;
      }
    }
    this.runAlgorithmEmitter.emit(new AlgorithmRun(routeAlgorithmRow, routeAlgorithm))
  }

}
