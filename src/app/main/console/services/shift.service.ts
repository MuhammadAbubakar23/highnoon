import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  constructor(private http: HttpClient) { }
  getShifts(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get( baseUrl + `Shift/GetAllShift?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}` )
  }
  getShiftById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Shift/GetShiftById/${id}`)
  }
  createShift(data: any): Observable<any> {

    return this.http.post(baseUrl + "Shift/AddShift", data)
  }
  updateShift(data: any): Observable<any> {

    return this.http.post(baseUrl + "Shift/UpdateShift", data)
  }
  deleteShift(id: any): Observable<any> {
    return this.http.delete(baseUrl + `Shift/DeleteShift/${id}`)
  }
  getShiftForDD(): Observable<any> {
    return this.http.get(baseUrl + `Shift/GetShiftForDD`)
  }
}
