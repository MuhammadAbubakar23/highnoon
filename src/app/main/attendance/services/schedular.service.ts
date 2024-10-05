import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class SchedularService {
  constructor(private http: HttpClient) { }

  getAllSchedular(data): Observable<any> {
    return this.http.post(baseUrl + "Scheduler/GetAllSchedule", data)
  }
  getTeamRequest(data): Observable<any> {
    return this.http.post(baseUrl + "Scheduler/GetTeamRequest", data)
  }
  getTeamSchedule(data): Observable<any> {
    return this.http.post(baseUrl + "Scheduler/GetTeamSchedule", data)
  }
  getmyRequestSchedule(data): Observable<any> {
    return this.http.post(baseUrl + "Scheduler/GetMyRequestSchedule", data)
  }
  getSchedularById(id, data): Observable<any> {
    return this.http.post(baseUrl + `Scheduler/GetSchedulebyId/${id}`, data)
  }
  getScheduleByDate(data: any): Observable<any> {
    return this.http.post(baseUrl + 'Scheduler/GetScheduleByDate', data)
  }
  createTeamSchedular(data: any): Observable<any> {
    return this.http.post(baseUrl + "Scheduler/AddSchedule", data)
  }
  addBulkSchedular(data: any): Observable<any> {
    return this.http.post(baseUrl + "Scheduler/AddBulkSchedule", data)
  }
  updateSchedular(data: any): Observable<any> {

    return this.http.put(baseUrl + "Scheduler/UpdateSchedule", data)
  }
  updateSchedularByManager(data: any): Observable<any> {

    return this.http.put(baseUrl + "Scheduler/UpdateScheduleByManager", data)
  }
  deleteSchedular(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Scheduler/DeleteSchedular/${id}`)
  }


  getScheduleRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `Scheduler/GetScheduleSummary/${id}`)
  }
  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  getScheduleReport(data: any): Observable<any> {
    return this.http.post(baseUrl + `Scheduler/GetScheduleReport`, data);
  }
  getTeamScheduleReport(data: any): Observable<any> {
    return this.http.post(baseUrl + `Scheduler/GetTeamScheduleReport`, data);
  }
  getTeamList(id): Observable<any> {
    return this.http.post(baseUrl + `Scheduler/GetTeamList?UserId=${id}`, {});
  }

}
