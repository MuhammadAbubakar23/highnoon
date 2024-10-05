import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class StageService {

  constructor(private http: HttpClient) { }

  getStages(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `Stage/GetAllStages?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getAllRequestStages(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `Stage/GetAllRequestStages?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }

  getStageById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Stage/GetStageById/${id}`)
  }
  createStage(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Stage/AddStage", data)
  }
  updateStage(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Stage/UpdateStage", data)
  }
  updateRequestStages(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  deleteStage(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `Stage/DeleteStage/${id}`)
  }
}

