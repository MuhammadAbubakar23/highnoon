import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  constructor(private http: HttpClient) { }

  getLeaveType(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `LeaveType/GetAllLeaveTypes?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getLeaveTypeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `LeaveType/GetLeaveTypebyId/${id}`)
  }
  createLeaveType(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "LeaveType/AddLeaveType", data)
  }
  updateLeaveType(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "LeaveType/UpdateLeaveType", data)
  }
  deleteLeaveType(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `LeaveType/DeleteLeaveType/${id}`)
  }
}
