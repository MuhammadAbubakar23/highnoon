import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) { }

  getLocations(pageNumber: number, pageSize: number, text: String
  ): Observable<any> {
    return this.http.get(baseUrl + `Location/GetAllLocations?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getLocationById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Location/GetLocationById/${id}`)
  }
  createLocation(data: any): Observable<any> {

    return this.http.post(baseUrl + "Location/AddLocation", data)
  }
  updateLocation(data: any): Observable<any> {

    return this.http.put(baseUrl + "Location/UpdateLocation", data)
  }
  deleteLocation(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Location/DeleteLocation/${id}`)
  }
}
