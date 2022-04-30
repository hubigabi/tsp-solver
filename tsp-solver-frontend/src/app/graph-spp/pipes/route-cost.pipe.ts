import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'routeCost'
})
export class RouteCostPipe implements PipeTransform {

  transform(value: string | null): string {
    if (value == null) {
      return '';
    } else if (+value === -1) {
      return "&infin;";
    } else {
      return value;
    }
  }

}
