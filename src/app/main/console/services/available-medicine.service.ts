import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class AvailableMedicineService {
  constructor(private http: HttpClient) { }

  getAvailableMedicine(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetAllAvailableMedicines?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getAvailableMedicineById(id: any): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetAvailableMedicineById/${id}`)
  }
  addAvailableMedicine(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "BenefitType/AddAvailableMedicine", data)
  }
  updateAvailableMedicine(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "BenefitType/UpdateAvailableMedicine", data)
  }
  deleteAvailableMedicine(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `BenefitType/DeleteAvailableMedicine/${id}`)
  }
}
