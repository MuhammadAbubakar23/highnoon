import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class WorkFlowService {
  constructor(private http: HttpClient) { }

  getWorkFlows(pageNumber: number, pageSize: number, text:String): Observable<any> {
    return this.http.get(baseUrl + `WorkFlow/GetAllWorkFlows?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }

  getWorkFlowById(id: any): Observable<any> {
    return this.http.get(baseUrl + `WorkFlow/GetWorkFlowById/${id}`)
  }
  createWorkFlow(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "WorkFlow/AddWorkFlow", data)
  }
  updateWorkFlow(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "WorkFlow/UpdateWorkFlow", data)
  }
  deleteWorkFlow(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `WorkFlow/DeleteWorkFlow/${id}`)
  }
}

