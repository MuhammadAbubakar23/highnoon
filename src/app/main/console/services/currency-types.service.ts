import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class CurrencyTypesService {

  constructor(private http: HttpClient) { }
  getAllCurrencyTypes(pageNumber: number, pageSize: number): Observable<any> {
    
    return this.http.get(baseUrl + `CurrencyTypes/GetAllCurrencyTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  createCurrencyType(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "CurrencyTypes/AddCurrencyType", data)
  }
  updateCurrencyType(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "CurrencyTypes/UpdateCurrencyType", data)
  }
  deleteCurrencyType(id): Observable<any> {
    return this.http.delete(baseUrl + `CurrencyTypes/DeleteCurrencyType/${id}`)
  }
  getCurrencyTypeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `CurrencyTypes/GetCurrencyTypeById/${id}`)
  }
}
