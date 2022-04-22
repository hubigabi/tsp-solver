import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RouteAlgorithm} from "../model/RouteAlgorithm";
import {Observable} from "rxjs";
import {City} from "../model/City";
import {environment} from "../../environments/environment";
import {SimulatedAnnealingRequest} from "../model/request/SimulatedAnnealingRequest";
import {GeneticAlgorithmRequest} from "../model/request/GeneticAlgorithmRequest";
import {AntColonyRequest} from "../model/request/AntColonyRequest";

@Injectable({
  providedIn: 'root'
})
export class TspAlgorithmService {

  private readonly NEAREST_NEIGHBOUR_URL = environment.backendUrl + '/api/tsp/nearest-neighbour';
  private readonly TWO_OPT_URL = environment.backendUrl + '/api/tsp/two-opt';
  private readonly SIMULATED_ANNEALING_URL = environment.backendUrl + '/api/tsp/simulated-annealing';
  private readonly GENETIC_ALGORITHM_URL = environment.backendUrl + '/api/tsp/genetic-algorithm';
  private readonly ANT_COLONY_URL = environment.backendUrl + '/api/tsp/ant-colony';

  constructor(private httpClient: HttpClient) {
  }

  public getNearestNeighbour(cities: City[]): Observable<RouteAlgorithm> {
    return this.httpClient.post<RouteAlgorithm>(this.NEAREST_NEIGHBOUR_URL, cities);
  }

  public getTwoOpt(cities: City[]): Observable<RouteAlgorithm> {
    return this.httpClient.post<RouteAlgorithm>(this.TWO_OPT_URL, cities);
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

}
