import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class DesignationSubsidyService {

  constructor(private http: HttpClient) { }

  getDesignationSubsidy(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetAllDesignationSubsidy?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getDesignationSubsidyById(id: any): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetDesignationSubsidyById/${id}`)
  }
  addDesignationSubsidy(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "BenefitType/AddDesignationSubsidy", data)
  }
  updateDesignationSubsidy(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "BenefitType/UpdateDesignationSubsidy", data)
  }
  deleteDesignationSubsidy(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `BenefitType/DeleteDesignationSubsidy/${id}`)
  }
}
