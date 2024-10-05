import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class TravelClassService {

  constructor(private http: HttpClient) { }
  getAllTravelClasses(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `TravelClass/GetAllTravelClass?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  createTravelClass(data: any): Observable<any> {
    return this.http.post(baseUrl + "TravelClass/AddTravelClass", data)
  }
  updateTravelClass(data: any): Observable<any> {
    return this.http.put(baseUrl + "TravelClass/UpdateTravelClass", data)
  }
  deleteTravelClass(id): Observable<any> {
    return this.http.delete(baseUrl + `TravelClass/DeleteTravelClass/${id}`)
  }
  getTravelClassById(id: any): Observable<any> {
    return this.http.get(baseUrl + `TravelClass/GetTravelClassById/${id}`)
  }
}