import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class BenefitsService {
  constructor(private http: HttpClient) { }
  getBenefits(data): Observable<any> {
    
    return this.http.post(baseUrl + "Benefit/GetAllBenefits", data)
  }
  getBenefitById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Benefit/GetBenefitById/${id}`)
  }
  getMedicineSubsidyByDesignation(id: any): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetMedicineSubsidy/${id}`)
  }
  getBenefitAvailablity(bTypeId: number, desId: string): Observable<any> {
    return this.http.get(baseUrl + `BenefitType/GetBenefitAvailablity/${bTypeId}/${desId}`)
  }
  cancelBenefit(id: any): Observable<any> {
    return this.http.put(baseUrl + `Benefit/CancelBenefitRequest/${id}`,{})
  }
  getBenefitRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `Benefit/GetBenefitRequestSummary/${id}`)
  }

  createBenefit(formData: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}Benefit/AddBenefit`, formData);
  }
  updateBenefit(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Leave/UpdateLeave", data)
  }
  deleteBenefit(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `Benefit/DeleteBenefit/${id}`)
  }
  getAllTeamBenefits(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Benefit/GetAllTeamBenefits", data)
  }


  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }


  getBenefitsReport(data: any) {
    return this.http.post(baseUrl + 'Benefit/GetBenefitsReport', data);
  }
  getTeamBenefitsReport(data: any) {
    return this.http.post(baseUrl + 'Benefit/GetTeamBenefitsReport', data);
  }
}
