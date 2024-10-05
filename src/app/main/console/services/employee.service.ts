import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

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
  updateProfilePicture(data: any): Observable<any> {
    return this.http.put(baseUrl + "Employee/UpdateProfilePicture", data)
  }
  updateEmployeeBasicProfile(data: any): Observable<any> {
    return this.http.put(baseUrl + "Employee/UpdateEmployeeBasicProfile", data)
  }
  updateEmployeeBankDetails(data: any): Observable<any> {
    return this.http.put(baseUrl + "Employee/UpdateEmployeeBankDetails", data)
  }
  updateEmployeeAddress(data: any): Observable<any> {
    return this.http.put(baseUrl + "Employee/UpdateEmployeeAddress", data)
  }
  updateEmployeeEducation(data: any): Observable<any> {
    return this.http.put(baseUrl + "Employee/UpdateEmployeeEducation", data)
  }
  updateEmployeeWorkExperience(data: any): Observable<any> {
    return this.http.put(baseUrl + "Employee/UpdateEmployeeWorkExperience", data)
  }

  deleteEmployee(id: any): Observable<any> {
    return this.http.delete(baseUrl + `Employee/DeleteEmployee/${id}`)
  }
  deleteWorkExperience(id: any): Observable<any> {
    return this.http.delete(baseUrl + `Employee/DeleteWorkExperience/${id}`)
  }
  deleteEducation(id: any): Observable<any> {
    return this.http.delete(baseUrl + `Employee/DeleteEducation/${id}`)
  }
  deleteEmployeeDocument(id: any): Observable<any> {
    return this.http.delete(baseUrl + `EmployeeDocument/DeleteEmployeeDocument/${id}`)
  }

  getProfileTeamRequests(data: any) {
    return this.http.post(baseUrl + 'Employee/GetAllTeamProfileRequest', data);
  }
  getProfileRequestsReport(data: any) {
    return this.http.post(baseUrl + 'Leave/GetLeaveReport', data);
  }
  getProfileTeamRequestReport(data: any) {
    return this.http.post(baseUrl + 'Leave/GetLeaveReport', data);
  }
  getRequests(data): Observable<any> {
    return this.http.post(baseUrl + "Employee/GetAllProfileRequest", data)
  }
  getRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `Employee/GetProfileRequestSummary/${id}`)
  }
  // getProfileTeamRequestSummary(id: any): Observable<any> {
  //   return this.http.get(baseUrl + `Leave/GetLeaveRequestSummary/${id}`)
  // }
  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  cancelProfileRequest(id: any): Observable<any> {
    return this.http.put(baseUrl + `Employee/CancelProfileRequest/${id}`, {})
  }
}
