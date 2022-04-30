import {RouteAlgorithmRow} from "../tsp-algorithms/RouteAlgorithmRow";
import {Observable} from "rxjs";
import {RouteAlgorithm} from "../model/RouteAlgorithm";

export class AlgorithmRun {
  routeAlgorithmRow: RouteAlgorithmRow
  routeAlgorithmObservable: Observable<RouteAlgorithm>

  constructor(routeAlgorithmRow: RouteAlgorithmRow, routeAlgorithmObservable: Observable<RouteAlgorithm>) {
    this.routeAlgorithmRow = routeAlgorithmRow;
    this.routeAlgorithmObservable = routeAlgorithmObservable;
  }

}
