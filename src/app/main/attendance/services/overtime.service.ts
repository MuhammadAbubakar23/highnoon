import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class OvertimeService {
  constructor(private http: HttpClient) { }

  getAllOvertime(data): Observable<any> {
    
    return this.http.post(baseUrl + "OverTime/GetOverTime", data)
  }
  getTeamOvertime(data): Observable<any> {
    
    return this.http.post(baseUrl + "OverTime/GetTeamOverTimeRequest", data)
  }
  getTeamOvertimeOvertime(data): Observable<any> {
    
    return this.http.post(baseUrl + "OverTime/GetAllOverTime", data)
  }
  getOvertimeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `OverTime/GetOverTimeById/${id}`)
  }
  createOvertime(data: any): Observable<any> {
    debugger
    return this.http.post(baseUrl + `OverTime/AddOverTimeRequest`, data)
  }
  updateOvertime(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "OverTime/UpdateOverTime", data)
  }
  deleteOvertime(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `OverTime/DeleteOverTime/${id}`)
  }

  getOvertimeRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `OverTime/GetOverTimeRequestSummary/${id}`)
  }
  getUnPlannedOverTime(data: any): Observable<any> {
    return this.http.post(baseUrl + 'OverTime/GetUnPlannedOverTime', data)
  }
  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  getOvertimeReport(data: any): Observable<any> {
    return this.http.post(baseUrl + `OverTime/GetOverTimeReport`, data);
  }
  GetOTEmployeeList(data): Observable<any> {
    return this.http.post(baseUrl + "OverTime/GetOTEmployeeList", data)
  }
  GetEmployeeShift(data): Observable<any> {
    return this.http.post(baseUrl + "OverTime/GetEmployeeShift", data)
  }
}
