import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
const imageBaseUrl = environment.imageBaseUrl;
@Injectable({
  providedIn: 'root'
})
export class BusinessTravelRequisitionService {

  constructor(private http: HttpClient) { }
  getRequisition(data): Observable<any> {
   
    return this.http.post(baseUrl + "TravelRequisition/GetAllTravelRequisition", data)
  }
  getTeamRequisition(data): Observable<any> {
   
    return this.http.post(baseUrl + "TravelRequisition/GetAllTeamTravelRequisition", data)
  }
  getRequisitionRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `TravelRequisition/GetTravelRequisitionSummary/${id}`)
  }
  createTravelRequisition(data): Observable<any> {
   
    return this.http.post(baseUrl + 'TravelRequisition/AddTravelRequisition', data);
  }
  updateTravelRequisition(data: any): Observable<any> {
   
    return this.http.post(baseUrl + "TravelRequisition/UpdateTravelRequisition", data)
  }
  cancelRequisition(id: any): Observable<any> {
    return this.http.put(baseUrl + `TravelRequisition/CancelTravelRequisitionRequest/${id}`,{})
  }
  deleteTravelRequisition(id): Observable<any> {
    return this.http.delete(baseUrl + `TravelRequisition/DeleteTravelRequisition/${id}`)
  }
  downloadAttachment(attachmentUrl: string): Observable<any> {
    return this.http.get(imageBaseUrl + attachmentUrl);
  }
  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }
  getRequisitionReport(data: any) {
    return this.http.post(baseUrl + 'TravelRequisition/GetTravelRequisitionReport', data);
  }
  getRequisitionTeamReport(data: any) {
    return this.http.post(baseUrl + 'TravelRequisition/GetTeamTravelRequisitionReport', data);
  }
}
