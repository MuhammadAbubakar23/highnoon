import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class LeavesService {

  constructor(private http: HttpClient) { }

  getLeaves(data): Observable<any> {

    return this.http.post(baseUrl + "Leave/GetAllLeaves", data)
  }
  getLeaveById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Leave/GetLeavebyId/${id}`)
  }
  getLeaveRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `Leave/GetLeaveRequestSummary/${id}`)
  }

  getLeaveQoutaByEmployeeId(id: any): Observable<any> {
    return this.http.get(baseUrl + `Leave/GetLeaveQoutabyEmployeeId/${id}`)
  }
  createLeave(data: any): Observable<any> {

    return this.http.post(baseUrl + "Leave/AddLeave", data)
  }
  updateLeave(data: any): Observable<any> {

    return this.http.put(baseUrl + "Leave/UpdateLeave", data)
  }
  cancelLeave(id: any): Observable<any> {
    return this.http.put(baseUrl + `Leave/CancelLeaveRequest/${id}`,{})
  }
  deleteLeave(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Leave/DeleteLeave/${id}`)
  }
  getAllTeamLeaves(data: any): Observable<any> {

    return this.http.post(baseUrl + "Leave/GetAllTeamLeaves", data)
  }


  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }


  getLeaveReport(data: any) {
    return this.http.post(baseUrl + 'Leave/GetLeaveReport', data);
  }
  getTeamLeaveReport(data: any) {
    return this.http.post(baseUrl + 'Leave/GetTeamLeavesReport', data);
  }
}
