import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class BusinessTravelReimbursementService {

  constructor(private http: HttpClient) { }
  getReimbursement(data): Observable<any> {

    return this.http.post(baseUrl + "TravelReimbursement/GetAllTravelReimbursement", data)
  }
  getRequisition(data): Observable<any> {
    
    return this.http.post(baseUrl + "TravelRequisition/GetAllTravelRequisition", data)
  }
  cancelReimbursement(id: any): Observable<any> {
    return this.http.put(baseUrl + `TravelReimbursement/CancelTravelReimbursementRequest/${id}`,{})
  }
  getApprovedRequisition(): Observable<any> {
    return this.http.get(baseUrl + "TravelRequisition/GetAllApproveRequisition")
  }
  getTeamReimbursement(data): Observable<any> {
    
    return this.http.post(baseUrl + "TravelReimbursement/GetAllTeamTravelReimbursement", data)
  }
  getReimbursementRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `TravelReimbursement/GetTravelReimbursementSummary/${id}`)
  }
  getRequisitionRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `TravelRequisition/GetTravelRequisitionSummary/${id}`)
  }
  createTravelReimbursement(data): Observable<any> {
    
    return this.http.post(baseUrl + 'TravelReimbursement/AddTravelReimbursement', data);
  }
  updateTravelReimbursement(data): Observable<any> {
    
    return this.http.post(baseUrl + 'TravelReimbursement/UpdateTravelReimbursement', data);
  }
  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }
  deleteTravelReimbursement(id): Observable<any> {
    return this.http.delete(baseUrl + `TravelReimbursement/DeleteTravelReimbursement/${id}`)
  }
  getReimbursementReport(data: any) {
    return this.http.post(baseUrl + 'TravelReimbursement/GetTravelReimbursementReport', data);
  }
  getReimbursementTeamReport(data: any) {
    return this.http.post(baseUrl + 'TravelReimbursement/GetTeamTravelReimbursementReport', data);
  }
}
