import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})

export class ReimbursementService {

  constructor(private http: HttpClient) { }

  getReimbursement(data): Observable<any> {

    return this.http.post(baseUrl + "Reimbursement/GetAllReimbursements", data)
  }
  getReimbursementById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Reimbursement/GetReimbursementById/${id}`)
  }
  getReimbursementRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `Reimbursement/GetReimbursementRequestSummary/${id}`)
  }
  cancelReimbursement(id: any): Observable<any> {
    return this.http.put(baseUrl + `Reimbursement/CancelReimbursementRequest/${id}`, {})
  }
  createReimbursement(data: any): Observable<any> {

    return this.http.post(baseUrl + "Reimbursement/AddReimbursement", data)
  }
  updateReimbursement(data: any): Observable<any> {

    return this.http.put(baseUrl + "ReimbursementFund/UpdateReimbursementFund", data)
  }
  deleteReimbursement(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Reimbursement/DeleteReimbursement/${id}`)
  }
  getAllTeamReimbursement(data: any): Observable<any> {

    return this.http.post(baseUrl + "Reimbursement/GetAllTeamReimbursements", data)
  }

  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  getReimbursementReport(data: any) {
    return this.http.post(baseUrl + 'Reimbursement/GetReimbursementsReport', data);
  }
  getTeamReimbursementReport(data: any) {
    return this.http.post(baseUrl + 'Reimbursement/GetTeamReimbursementsReport', data);
  }

}
