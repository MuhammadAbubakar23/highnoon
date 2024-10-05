import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }

  getAllAttendance(data): Observable<any> {

    return this.http.post(baseUrl + "Attendance/GetAllAttendance", data)
  }
  getAllTeamAttendanceRequests(data): Observable<any> {
    return this.http.post(baseUrl + "Attendance/GetAllTeamAttendanceRequest", data)
  }
  getAllTeamAttendance(data): Observable<any> {
    return this.http.post(baseUrl + "Attendance/GetAllTeamAttendance", data)
  }
  getAllAttendanceRequests(data): Observable<any> {

    return this.http.post(baseUrl + "Attendance/GetMyRequestAttendance", data)
  }
  getRecentAttendance(): Observable<any> {

    return this.http.get(baseUrl + "Attendance/GetLatestChecks")
  }

  getAttendanceById(id: any): Observable<any> {
    return this.http.post(baseUrl + `Attendance/GetAttendancebyId/${id}`, { id: id })
  }
  createAttendance(data: any): Observable<any> {

    return this.http.post(baseUrl + "Attendance/AddAttendance", data)
  }
  createTeamAttendance(data: any): Observable<any> {
    return this.http.post(baseUrl + "Attendance/AddTeamAttendance", data)
  }
  updateAttendance(data: any): Observable<any> {
    

    return this.http.post(baseUrl + "Attendance/UpdateAttendance", data)
  }
  deleteAttendance(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Attendance/DeleteAttendance/${id}`)
  }
  getAttendanceRequestSummary(id: any): Observable<any> {

    return this.http.get(baseUrl + `Attendance/GetAttendanceSummary/${id}`)
  }
  cancelRequest(id: any): Observable<any> {
    return this.http.post(baseUrl + `Attendance/CancelAttendanceRequest/${id}`, {})
  }
  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }
  getAttendanceReport(data: any): Observable<any> {
    return this.http.post(baseUrl + `Attendance/GetAttendanceReport`, data);
  }
  getTeamAttendanceReport(data: any) {
    return this.http.post(baseUrl + 'Leave/GetTeamLeavesReport', data);
  }
  //Attendance/GetAttendanceEmployeeList
  getAttendanceEmployeeList(data: any) {
    return this.http.post(baseUrl + 'Attendance/GetAttendanceEmployeeList', data);
  }
}
