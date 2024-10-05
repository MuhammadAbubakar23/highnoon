import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class LeaveStatusService {
  constructor(private http: HttpClient) { }

  getLeaveStatus(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `LeaveStatus/GetAllLeaveStatuses?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getLeaveStatusById(id: any): Observable<any> {
    return this.http.get(baseUrl + `LeaveStatus/GetLeaveStatusbyId/${id}`)
  }
  createLeaveStatus(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "LeaveStatus/AddLeaveStatus", data)
  }
  updateLeaveStatus(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "LeaveStatus/UpdateLeaveStatus", data)
  }
  deleteLeaveStatus(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `LeaveStatus/DeleteLeaveStatus/${id}`)
  }
}
