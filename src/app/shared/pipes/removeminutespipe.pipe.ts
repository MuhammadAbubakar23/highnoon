import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeminutespipe'
})
export class RemoveminutespipePipe implements PipeTransform {

  NewDateTime:any;

  transform(value: any,timeDiff:any): any {
    
    this.NewDateTime = new Date(value);
    this.NewDateTime.setMinutes(this.NewDateTime.getMinutes() - timeDiff);
    return this.NewDateTime;
  }

}
