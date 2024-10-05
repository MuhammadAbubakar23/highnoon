import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  constructor(private http: HttpClient) { }

  getEmployer(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `Employer/GetAllEmployers?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getEmployerById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Employer/GetEmployerById/${id}`)
  }
  createEmployer(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Employer/AddEmployer", data)
  }
  updateEmployer(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Employer/UpdateEmployer", data)
  }
  deleteEmployer(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `Employer/DeleteEmployer/${id}`)
  }
}

