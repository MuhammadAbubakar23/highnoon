import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class TravelPreferenceTimeService {

  constructor(private http: HttpClient) { }
  getAllTravelPreferenceTime(pageNumber: number, pageSize: number): Observable<any> {
    
    return this.http.get(baseUrl + `TravelPreferneceTime/GetAllTravelPreferenceTime?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  createTravelPreferenceTime(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "TravelPreferneceTime/AddTravelPreferenceTime", data)
  }
  updateTravelPreferenceTime(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "TravelPreferneceTime/UpdateTravelPreferenceTime", data)
  }
  deleteTravelPreferenceTime(id): Observable<any> {
    return this.http.delete(baseUrl + `TravelPreferneceTime/DeleteTravelPreferenceTime/${id}`)
  }
  getTravelPreferenceTimeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `TravelPreferneceTime/GetTravelPreferenceTimeById/${id}`)
  }
}
