import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class CityService {
  constructor(private http: HttpClient) { }

  getCity(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `City/GetAllCities?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getCityById(id: any): Observable<any> {
    return this.http.get(baseUrl + `City/GetCityById/${id}`)
  }
  createCity(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "City/AddCity", data)
  }
  updateCity(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "City/UpdateCity", data)
  }
  deleteCity(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `City/DeleteCity/${id}`)
  }
}
