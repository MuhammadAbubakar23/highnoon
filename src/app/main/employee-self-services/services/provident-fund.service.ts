import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class ProvidentFundService {
  constructor(private http: HttpClient) { }

  getProvident(data): Observable<any> {

    return this.http.post(baseUrl + "ProvidentFund/GetProvidentFund", data)
  }
  getPFStats(data): Observable<any> {

    return this.http.post(baseUrl + "ProvidentFund/GetPFStats", data)
  }
  //https://connectapi-staging.highnoon.com.pk/api/ProvidentFund/GetPFStats
  getProvidentById(id: any): Observable<any> {
    return this.http.get(baseUrl + `ProvidentFund/GetPFbyId/${id}`)
  }
  getProvidentRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `ProvidentFund/GetPFSummary/${id}`)
  }

  createProvident(data: any): Observable<any> {

    return this.http.post(baseUrl + "ProvidentFund/AddProvidentFund", data)
  }
  updateProvident(data: any): Observable<any> {

    return this.http.put(baseUrl + "ProvidentFund/UpdateProvidentFund", data)
  }
  deleteProvident(id: any): Observable<any> {

    return this.http.delete(baseUrl + `ProvidentFund/DeleteProvidentFund/${id}`)
  }
  getAllTeamProvident(data: any): Observable<any> {

    return this.http.post(baseUrl + "ProvidentFund/GetTeamProvidentFund", data)
  }

  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  getProvidentReport(data: any): Observable<any> {
    return this.http.post(baseUrl + 'ProvidentFund/GetPFReport', data);
  }

  getTeamProvidentReport(data: any): Observable<any> {
    return this.http.post(baseUrl + 'ProvidentFund/GetTeamPFReport', data);
  }

}
