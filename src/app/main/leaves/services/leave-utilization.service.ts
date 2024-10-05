import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class LeaveUtilizationService {

  constructor(private http: HttpClient) { }

  getLeaveUtilization(data): Observable<any> {
    return this.http.post(baseUrl + "LeaveUtilization/GetAllLeaveUtilization", data)
  }
  getTeamLeaveUtilizations(data): Observable<any> {
    return this.http.post(baseUrl + "LeaveUtilization/GetTeamLeaveUtilizations", data)
  }

  getLeaveUtilizationById(id: any): Observable<any> {
    return this.http.get(baseUrl + `LeaveUtilization/GetUtilizationById/${id}`)
  }
  getLeaveUtilRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `LeaveUtilization/GetLeaveUtilRequestSummary/${id}`)
  }

  createLeaveUtilization(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "LeaveUtilization/AddLeaveUtilization", data)
  }
  updateLeaveUtilization(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "LeaveUtilization/UpdateLeaveUtilization", data)
  }
  deleteLeaveUtilization(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `LeaveUtilization/DeleteLeaveUtilization/${id}`)
  }
  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  getLeaveUtilizationReport(data: any) {
    return this.http.post(baseUrl + 'LeaveUtilization/GetLeaveUtilizationReport', data);
  }
  getTeamLeaveUtilizationReport(data: any) {
    return this.http.post(baseUrl + 'LeaveUtilization/GetTeamLeaveUtilizationReport', data);
  }
}
