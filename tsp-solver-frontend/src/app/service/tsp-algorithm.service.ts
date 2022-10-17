import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RouteAlgorithm} from "../model/RouteAlgorithm";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {SimulatedAnnealingRequest} from "../model/request/tsp/SimulatedAnnealingRequest";
import {GeneticAlgorithmRequest} from "../model/request/tsp/GeneticAlgorithmRequest";
import {AntColonyRequest} from "../model/request/tsp/AntColonyRequest";
import {City} from "../model/City";

@Injectable({
  providedIn: 'root'
})
export class TspAlgorithmService {

  private readonly NEAREST_NEIGHBOUR_URL = environment.backendUrl + '/api/tsp/nearest-neighbour';
  private readonly TWO_OPT_URL = environment.backendUrl + '/api/tsp/two-opt';
  private readonly SIMULATED_ANNEALING_URL = environment.backendUrl + '/api/tsp/simulated-annealing';
  private readonly GENETIC_ALGORITHM_URL = environment.backendUrl + '/api/tsp/genetic-algorithm';
  private readonly ANT_COLONY_URL = environment.backendUrl + '/api/tsp/ant-colony';
  private readonly ATT48_PROBLEM_URL = environment.backendUrl + '/api/tsp/att48';

  constructor(private httpClient: HttpClient) {
  }

  public getNearestNeighbour(costMatrix: number[][]): Observable<RouteAlgorithm> {
    return this.httpClient.post<RouteAlgorithm>(this.NEAREST_NEIGHBOUR_URL, costMatrix);
  }

  public getTwoOpt(costMatrix: number[][]): Observable<RouteAlgorithm> {
    return this.httpClient.post<RouteAlgorithm>(this.TWO_OPT_URL, costMatrix);
  }

  public getSimulatedAnnealing(request: SimulatedAnnealingRequest): Observable<RouteAlgorithm> {
    return this.httpClient.post<RouteAlgorithm>(this.SIMULATED_ANNEALING_URL, request);
  }

  public getGeneticAlgorithm(request: GeneticAlgorithmRequest): Observable<RouteAlgorithm> {
    return this.httpClient.post<RouteAlgorithm>(this.GENETIC_ALGORITHM_URL, request);
  }

  public getAntColonyOptimization(request: AntColonyRequest): Observable<RouteAlgorithm> {
    return this.httpClient.post<RouteAlgorithm>(this.ANT_COLONY_URL, request);
  }

  public getAtt48Problem(): Observable<City[]> {
    return this.httpClient.get<City[]>(this.ATT48_PROBLEM_URL);
  }

}
