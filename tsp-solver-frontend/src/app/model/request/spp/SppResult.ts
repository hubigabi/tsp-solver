import {Route} from "./Route";

export class SppResult {
  routesMatrix: Route[][];

  constructor(routesMatrix: Route[][]) {
    this.routesMatrix = routesMatrix;
  }

}
