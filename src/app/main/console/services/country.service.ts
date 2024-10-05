import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }

  getCountry(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `Country/GetAllCountries?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getCountryById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Country/GetTCountryById/${id}`)
  }
  createCountry(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Country/AddCountry", data)
  }
  updateCountry(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Country/UpdateCountry", data)
  }
  deleteCountry(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `Country/DeleteCountry/${id}`)
  }
}

