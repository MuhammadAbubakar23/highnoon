import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectionFilter'
})
export class SelectionFiltePipe implements PipeTransform {

  transform(item: any[], selectedValue: any): any[] {
    if(item || !selectedValue){
      return item;
    }
    return item.filter(item => item.propertyToFilter === selectedValue);
  }

}
