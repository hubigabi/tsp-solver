import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterSelectedNode'
})
export class FilterSelectedNodePipe implements PipeTransform {

  transform(ids: string[], id: string): string[] {
    if (ids) {
      return ids.filter(e => {
        return e !== id;
      });
    }
    return [];
  }

}
