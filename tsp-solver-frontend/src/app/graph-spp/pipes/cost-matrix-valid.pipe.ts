import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'costMatrixValid'
})
export class CostMatrixValidPipe implements PipeTransform {

  transform(costMatrix: number[][]): boolean {
    for (let i = 0; i < costMatrix.length; i++) {
      for (let j = 0; j < costMatrix[i].length; j++) {
        if (costMatrix[i][j] === -1) {
          return false;
        }
      }
    }

    return true;
  }

}
