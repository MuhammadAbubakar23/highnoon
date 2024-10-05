import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})

export class DropDownApiService {

  constructor(private http: HttpClient) { }
  getEmployeeTypeForDD(): Observable<any> {
    return this.http.get(baseUrl + "EmployeeType/GetEmployeeTypeForDD")
  }

  //Dependant/GetRelationForDD
  getRelationForDD(): Observable<any> {
    return this.http.get(baseUrl + "Dependant/GetRelationForDD")
  }
  getMaritalStatusForDD(): Observable<any> {
    return this.http.get(baseUrl + "Employee/GetMaritalStatusForDD")
  }
  //
  getDesignationForDD(): Observable<any> {
    return this.http.get(baseUrl + "Designation/GetDesignationForDD")
  }
  getTeamsForDD(): Observable<any> {
    return this.http.get(baseUrl + "Team/GetTeamsForDD")
  }
  getJobTitleForDD(): Observable<any> {
    return this.http.get(baseUrl + "JobTitle/GetJobTitleForDD")
  }
  getEmployeesForDD(): Observable<any> {
    return this.http.get(baseUrl + "Employee/GetEmployeesForDD")
  }
  getCountriesForDD(): Observable<any> {
    return this.http.get(baseUrl + "Country/GetCountriesForDD")
  }
  getCitiesForDD(): Observable<any> {
    return this.http.get(baseUrl + "City/GetCitiesForDD")
  }
  getStatesForDD(): Observable<any> {
    return this.http.get(baseUrl + "State/GetStatesForDD")
  }
  getDepartmentsForDD(): Observable<any> {
    return this.http.get(baseUrl + "Department/GetDepartmentsForDD")
  }
  getEmployersForDD(): Observable<any> {
    return this.http.get(baseUrl + "Employer/GetEmployersForDD")
  }
  getLeaveTypesForDD(): Observable<any> {
    return this.http.get(baseUrl + "LeaveType/GetLeaveTypesForDD")
  }
  getLeaveStatusForDD(): Observable<any> {
    return this.http.get(baseUrl + "LeaveStatus/GetLeaveStatusesForDD")
  }

  getLocationsForDD(): Observable<any> {
    return this.http.get(baseUrl + "Location/GetLocationsForDD")
  }
  getLocationsforDDD(): Observable<any> {
    return this.http.get(baseUrl + "Attendance/GetTerminalLoc")
  }
  getRolesForDD(): Observable<any> {
    return this.http.get(baseUrl + "Roles/GetRolesForDD")
  }
  getParentPermissionsForDD(): Observable<any> {
    return this.http.get(baseUrl + "Permission/GetParentPermissionsForDD")
  }
  getPermissionsForDD(): Observable<any> {
    return this.http.get(baseUrl + "Permission/GetPermissionsForDD")
  }
  getParentMenusForDD(): Observable<any> {
    return this.http.get(baseUrl + "Menu/GetParentMenusForDD")
  }
  getCategoriesForDD(): Observable<any> {
    return this.http.get(baseUrl + "Category/GetCategoriesForDD")
  }
  getStagesForDD(): Observable<any> {
    return this.http.get(baseUrl + "Stage/GetStagesForDD")
  }
  getWorkFlowsForDD(): Observable<any> {
    return this.http.get(baseUrl + "WorkFlow/GetWorkFlowsForDD")
  }
  getBenefitTypeForDD(): Observable<any> {
    return this.http.get(baseUrl + "BenefitType/GetBenefitTypesForDD")
  }
  getAvailableMedicineForDD(): Observable<any> {
    return this.http.get(baseUrl + "BenefitType/GetAvailableMedicineForDD")
  }

  getLoanTypeForDD(): Observable<any> {
    return this.http.get(baseUrl + "LoanType/GetLoanTypesForDD")
  }
  getQualification1ForDD(): Observable<any> {
    return this.http.get(baseUrl + "Employee/GetQualification1ForDD")
  }
  //Employee/GetBanksForDD
  getQualification2ForDD(): Observable<any> {
    return this.http.get(baseUrl + "Employee/GetQualification2ForDD")
  }
  getBanksForDD(): Observable<any> {
    return this.http.get(baseUrl + "Employee/GetBanksForDD")
  }
  //api/Scheduler/GetTeamList
}
