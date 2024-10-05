import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  getBirthdays(): Observable<any> {

    return this.http.get(baseUrl + "Dashboard/GetBirthdays")
  }
  getBenefits(): Observable<any> {

    return this.http.get(baseUrl + "Dashboard/GetBenefits")
  }
  getLatestChecks(date): Observable<any> {
    return this.http.get(baseUrl + `Dashboard/GetLatestChecks/${date}`)
  }
  getVacantJobs(): Observable<any> {
    return this.http.get('http://recruitment-staging.highnoon.com.pk:3000/api/job/list')
  }
  getReportingHierarchy(id): Observable<any> {
    return this.http.get(baseUrl + `Dashboard/GetReportingHierarchy/${id}`)
  }
///Dashboard/GetReportingHierarchy
}
