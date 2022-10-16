import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {CrossoverType} from "../model/request/tsp/ga/CrossoverType";
import {SelectionType} from "../model/request/tsp/ga/SelectionType";
import {TranslateService} from "@ngx-translate/core";
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-algorithm-form',
  templateUrl: './algorithm-form.component.html',
  styleUrls: ['./algorithm-form.component.css']
})
export class AlgorithmFormComponent implements OnInit {

  @Input() costMatrix: number[][] = [];
  @Output() runAlgorithmEmitter = new EventEmitter<AlgorithmRun>();
  chosenAlgorithm = "0";

  selectionTypes = Object.keys(SelectionType).filter((item) => {
    return isNaN(Number(item));
  });
  crossoverTypes = Object.keys(CrossoverType).filter((item) => {
    return isNaN(Number(item));
  });

  simulatedAnnealingForm = this.fb.group({
    maxTemperature: [100.0, [Validators.required, Validators.min(1)]],
    minTemperature: [0.1, [Validators.required, Validators.min(0)]],
    coolingRate: [0.99, [Validators.required, Validators.min(0.0001), Validators.max(0.9999)]],
    iterations: [1000, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
  });

  geneticAlgorithmForm = this.fb.group({
    populationSize: [100, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
    elitismSize: [20, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]],
    mutationRate: [0.01, [Validators.required, Validators.min(0.0), Validators.max(1)]],
    epochs: [3000, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
    selectionType: ['', Validators.required],
    crossoverType: ['', Validators.required],
  });

  antColonyOptimizationForm = this.fb.group({
    alpha: [1, [Validators.required, Validators.min(0)]],
    beta: [5, [Validators.required, Validators.min(0)]],
    evaporationRate: [0.5, [Validators.required, Validators.min(0.0), Validators.max(1)]],
    q: [100, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
    antFactor: [0.8, [Validators.required, Validators.min(0.1)]],
    randomCitySelection: [0.01, [Validators.required, Validators.min(0.0), Validators.max(1)]],
    iterations: [50, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
  });

  maxIterationsNoImprovementForm = this.fb.group({
    isMaxIterationsNoImprovement: [false, []],
    maxIterationsNoImprovement: [100, [Validators.min(1), Validators.pattern("^[0-9]*$")]],
  });

  isMaxIterationsNoImprovementSelected = false;

  constructor(private fb: FormBuilder, private tspAlgorithmService: TspAlgorithmService,
              private translateService: TranslateService, private titleCasePipe: TitleCasePipe) {
  }

  ngOnInit(): void {
    this.simulatedAnnealingForm.setValidators(this.greaterThan('maxTemperature', 'minTemperature'));
    this.geneticAlgorithmForm.setValidators(this.greaterThan('populationSize', 'elitismSize'));

    this.geneticAlgorithmForm.get('selectionType')!.setValue(this.selectionTypes.length > 0 ? this.selectionTypes[0] : '');
    this.geneticAlgorithmForm.get('crossoverType')!.setValue(this.crossoverTypes.length > 0 ? this.crossoverTypes[0] : '');
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
        const iterations = this.simulatedAnnealingForm.get('iterations')!.value;
        const maxIterationsNoImprovement = this.getMaxIterationsNoImprovement();

        routeAlgorithmRow.algorithmType = 'Simulated annealing';
        routeAlgorithmRow.parametersTranslation = 'SimulatedAnnealingParameters';
        routeAlgorithmRow.parameters = {
          maxTemperature: maxTemperature,
          minTemperature: minTemperature,
          coolingRate: coolingRate,
          iterations: iterations
        };

        const simulatedAnnealingRequest = new SimulatedAnnealingRequest(this.costMatrix,
          maxTemperature, minTemperature, coolingRate, iterations, maxIterationsNoImprovement);
        routeAlgorithm = this.tspAlgorithmService.getSimulatedAnnealing(simulatedAnnealingRequest);
        break;
      }
      case '3': {
        const populationSize = this.geneticAlgorithmForm.get('populationSize')!.value;
        const elitismSize = this.geneticAlgorithmForm.get('elitismSize')!.value;
        const mutationRate = this.geneticAlgorithmForm.get('mutationRate')!.value;
        const epochs = this.geneticAlgorithmForm.get('epochs')!.value;
        const selectionType = SelectionType[this.geneticAlgorithmForm.get('selectionType')!.value as keyof typeof SelectionType];
        const crossoverType = CrossoverType[this.geneticAlgorithmForm.get('crossoverType')!.value as keyof typeof CrossoverType];
        const maxEpochsNoImprovement = this.getMaxIterationsNoImprovement();

        routeAlgorithmRow.algorithmType = 'Genetic algorithm';
        routeAlgorithmRow.parametersTranslation = 'GeneticAlgorithmParameters';
        routeAlgorithmRow.parameters = {
          populationSize: populationSize,
          elitismSize: elitismSize,
          mutationRate: mutationRate,
          epochs: epochs,
          selectionType: SelectionType[selectionType],
          crossoverType: CrossoverType[crossoverType],
        };

        const selectionTypeTranslationKey = this.titleCasePipe.transform(SelectionType[selectionType]);
        this.translateService.onLangChange.subscribe(() => {
          this.translateSelectionType(routeAlgorithmRow, selectionTypeTranslationKey);
        });
        this.translateSelectionType(routeAlgorithmRow, selectionTypeTranslationKey);

        const geneticAlgorithmRequest = new GeneticAlgorithmRequest(this.costMatrix, populationSize,
          elitismSize, mutationRate, epochs, maxEpochsNoImprovement, selectionType, crossoverType);
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
        const maxIterationsNoImprovement = this.getMaxIterationsNoImprovement();

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

        const antColonyRequest = new AntColonyRequest(this.costMatrix, alpha, beta, evaporationRate,
          q, antFactor, randomCitySelection, iterations, maxIterationsNoImprovement);
        routeAlgorithm = this.tspAlgorithmService.getAntColonyOptimization(antColonyRequest);
        break;
      }
      default: {
        break;
      }
    }
    this.runAlgorithmEmitter.emit(new AlgorithmRun(routeAlgorithmRow, routeAlgorithm))
  }

  getMaxIterationsNoImprovement(): number {
    const isMaxIterationsNoImprovement = this.maxIterationsNoImprovementForm.get('isMaxIterationsNoImprovement')!.value;
    const maxIterationsNoImprovement = this.maxIterationsNoImprovementForm.get('maxIterationsNoImprovement')!.value;
    if (isMaxIterationsNoImprovement) {
      return maxIterationsNoImprovement;
    } else {
      return -1;
    }
  }

  onMaxIterationsNoImprovementSelectionChange(event: any) {
    this.isMaxIterationsNoImprovementSelected = event.currentTarget.checked;
    if (this.isMaxIterationsNoImprovementSelected) {
      this.maxIterationsNoImprovementForm.get('maxIterationsNoImprovement')!.addValidators([Validators.required]);
    } else {
      this.maxIterationsNoImprovementForm.get('maxIterationsNoImprovement')!.removeValidators([Validators.required]);
    }
  }

  onChosenAlgorithmChange(iterations: string) {
    const percentFromIterations = 10;
    let maxIterationsNoImprovement = (percentFromIterations / 100) * +iterations;
    maxIterationsNoImprovement = Math.ceil(maxIterationsNoImprovement / 10) * 10;
    this.maxIterationsNoImprovementForm.get('maxIterationsNoImprovement')!.setValue(maxIterationsNoImprovement);
  }


  translateSelectionType(routeAlgorithmRow: RouteAlgorithmRow, key: string) {
    this.translateService.get(key)
      .subscribe(value => routeAlgorithmRow.parameters.selectionType = value);
  }

}
