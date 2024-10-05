import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private http: HttpClient) { }

  getState(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `State/GetAllStates?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getStateById(id: any): Observable<any> {
    return this.http.get(baseUrl + `State/GetStateById/${id}`)
  }
  createState(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "State/AddState", data)
  }
  updateState(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "State/UpdateState", data)
  }
  deleteState(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `State/DeleteState/${id}`)
  }
}
