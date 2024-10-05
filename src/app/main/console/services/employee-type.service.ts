import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeService {

  constructor(private http: HttpClient) { }

  getEmplyeeType(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `EmployeeType/GetAllEmployeeTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }

  getEmplyeeTypeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `EmployeeType/GetEmployeeTypeById/${id}`)
  }
  createEmplyeeType(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "EmployeeType/AddEmployeeType", data)
  }
  updateEmplyeeType(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "EmployeeType/UpdateEmployeeType", data)
  }
  deleteEmplyeeType(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `EmployeeType/DeleteEmployee/${id}`)
  }
}
