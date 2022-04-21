import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RouteAlgorithm} from "../model/RouteAlgorithm";
import {Observable} from "rxjs";
import {City} from "../model/City";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TspAlgorithmService {

  private readonly NEAREST_NEIGHBOUR_URL = environment.backendUrl + '/api/tsp/nearestNeighbour';

  constructor(private httpClient: HttpClient) {
  }

  public getNearestNeighbour(cities: City[]): Observable<RouteAlgorithm> {
    return this.httpClient.post<RouteAlgorithm>(this.NEAREST_NEIGHBOUR_URL, cities);
  }

}
