import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class BenefitAvailabilityService {

  constructor(private http: HttpClient) { }

  getBenefitAvailablities(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetAllBenefitAvailablities?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getBenefitAvailabilityById(id: any): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetBenefitAvailablityById/${id}`)
  }
  addBenefitAvailability(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "BenefitType/AddBenefitAvailability", data)
  }
  updateBenefitAvailability(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "BenefitType/UpdateBenefitAvailability", data)
  }
  deleteBenefitAvailability(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `BenefitType/DeleteBenefitAvailability/${id}`)
  }
}
