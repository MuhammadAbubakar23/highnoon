import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class JobTitleService {

  constructor(private http: HttpClient) { }

  getJobTitle(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `JobTitle/GetAllJobTitle?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getJobTitleById(id: any): Observable<any> {
    return this.http.get(baseUrl + `JobTitle/GetJobTitleById/${id}`)
  }
  createJobTitle(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "JobTitle/AddJobTitle", data)
  }
  updateJobTitle(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "JobTitle/UpdateJobTitle", data)
  }
  deleteJobTitle(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `JobTitle/DeleteJobTile/${id}`)
  }
}
