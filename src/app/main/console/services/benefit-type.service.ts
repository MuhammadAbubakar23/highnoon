import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class BenefitTypeService {
  constructor(private http: HttpClient) { }

  getBenefitType(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetAllBenefitTypes?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getBenefitTypeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetBenefitTypeById/${id}`)
  }
  addBenefitType(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "BenefitType/AddBenefitType", data)
  }
  updateBenefitType(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "BenefitType/UpdateBenefitType", data)
  }
  deleteBenefitType(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `BenefitType/DeleteBenefitType/${id}`)
  }
}
