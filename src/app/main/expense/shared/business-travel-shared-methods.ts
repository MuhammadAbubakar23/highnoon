import { Injectable } from '@angular/core';
import { TravelTypesService } from '../../console/services/travel-types.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessTravelSharedMethods {
constructor(private travelS: TravelTypesService){

}
  getStatusText(id: number): string {
      const statusMap = {
        1: 'Pending',
        2: 'Approved',
        3: 'Rejected',
        4: 'Canceled'
      };
      return statusMap[id] || 'Undefined';
    }

  convertToShortDate(dateTimeString: string): string {
    const datePart = dateTimeString.split('T')[0];
    return datePart;
  }
}