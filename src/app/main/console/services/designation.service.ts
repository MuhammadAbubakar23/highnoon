import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class DesignationService {

  constructor(private http: HttpClient) { }

  getDesignations(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `Designation/GetAllDesignations?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }

  getDesignationById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Designation/GetDesignationById/${id}`)
  }
  createDesignation(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Designation/AddDesignation", data)
  }
  updateDesignation(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Designation/UpdateDesignation", data)
  }
  deleteDesignation(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `Designation/DeleteDesignation/${id}`)
  }
}
