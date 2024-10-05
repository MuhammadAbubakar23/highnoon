import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class TravelTypesService {

  constructor(private http: HttpClient) { }
  getAllTravelTypes(pageNumber: number, pageSize: number): Observable<any> {
   
    return this.http.get(baseUrl + `TravellingBy/GetAllTravelTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  createTravelType(data: any): Observable<any> {
   
    return this.http.post(baseUrl + "TravellingBy/AddTravelType", data)
  }
  updateTravelType(data: any): Observable<any> {
   
    return this.http.put(baseUrl + "TravellingBy/UpdateTravelType", data)
  }
  deleteTravelType(id): Observable<any> {
    return this.http.delete(baseUrl + `TravellingBy/DeleteTravelType/${id}`)
  }
  getTravelTypeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `TravellingBy/GetTravelTypeById/${id}`)
  }}
