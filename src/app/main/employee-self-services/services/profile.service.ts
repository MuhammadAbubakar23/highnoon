import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getEmployees(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `Employee/GetAllEmployees?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getEmployeeDocuments(pageNumber: number, pageSize: number, searchText: string): Observable<any> {
    return this.http.get(baseUrl + `EmployeeDocument/GetAllEmployeeDocuments?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${searchText}`)
  }
  getEmployeeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Employee/GetEmployeeById/${id}`)
  }
  createEmployee(data: any): Observable<any> {
    return this.http.post(baseUrl + "Employee/AddEmployee", data)
  }
  createEmployeeDocuments(data: any): Observable<any> {
    return this.http.post(baseUrl + "EmployeeDocument/AddEmployeeDocument", data)
  }
  updateEmployee(data: any): Observable<any> {
    return this.http.put(baseUrl + "Employee/UpdateEmployee", data)
  }
  deleteEmployee(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Employee/DeleteEmployee/${id}`)
  }
  deleteEmployeeDocument(id: any): Observable<any> {
    return this.http.delete(baseUrl + `EmployeeDocument/DeleteEmployeeDocument/${id}`)
  }
  getRequests(data): Observable<any> {
    return this.http.post(baseUrl + "Leave/GetAllLeaves", data)
  }
  getTeamRequests(data: any) {
    return this.http.post(baseUrl + 'Employee/GetAllTeamProfileRequest', data);
  }
  getRequestsReport(data: any) {
    return this.http.post(baseUrl + 'Leave/GetLeaveReport', data);
  }
  getTeamRequestReport(data: any) {
    return this.http.post(baseUrl + 'Leave/GetLeaveReport', data);
  }

  getRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `Leave/GetLeaveRequestSummary/${id}`)
  }
  getTeamRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `Leave/GetLeaveRequestSummary/${id}`)
  }
  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  cancelProfileRequest(id: any): Observable<any> {
    return this.http.put(baseUrl + `Leave/CancelLeaveRequest/${id}`,{})
  }
}
