import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  getDepartments(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `Department/GetAllDepartments?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getDepartmentById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Department/GetDeparmentById/${id}`)
  }
  createDepartment(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Department/AddDepartment", data)
  }
  updateDepartment(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Department/UpdateDepartment", data)
  }
  deleteDepartment(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `Department/DeleteDepartment/${id}`)
  }
}
