import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class OpdService {
  constructor(private http: HttpClient) { }

  getOpd(data): Observable<any> {
    
    return this.http.post(baseUrl + "MedicalExpense/GetAllMedicalExpense", data)
  }
  getOpdById(id: any): Observable<any> {
    return this.http.get(baseUrl + `MedicalExpense/GetMedicalExpenseById/${id}`)
  }
  getOpdRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `MedicalExpense/GetMedicalExpenseRequestSummary/${id}`)
  }
  cancelOpd(id: any): Observable<any> {
    return this.http.put(baseUrl + `MedicalExpense/CancelMedicalExpenseRequest/${id}`,{})
  }
  createOpd(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "MedicalExpense/AddMedicalExpense", data)
  }
  updateOpd(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "OpdFund/UpdateOpdFund", data)
  }
  deleteOpd(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `MedicalExpense/DeleteMedicalExpense/${id}`)
  }
  getAllTeamOpd(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "MedicalExpense/GetAllTeamMedicalExpense", data)
  }

  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  getOpdReport(data: any) {
    return this.http.post(baseUrl + 'MedicalExpense/GetMedicalExpenseReport', data);
  }
  getOpdTeamReport(data: any) {
    return this.http.post(baseUrl + 'MedicalExpense/GetTeamMedicalExpenseReport', data);
  }
}
