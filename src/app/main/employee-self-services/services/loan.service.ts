import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class LoanService { 
  constructor(private http: HttpClient) { }

  getLoan(data): Observable<any> {
    return this.http.post(baseUrl + "Loan/GetAllLoans", data)
  }
  getLoanById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Loan/GetLoanById/${id}`)
  }
  getLoanRequestSummary(id: any): Observable<any> {
    return this.http.get(baseUrl + `Loan/GetLoanRequestSummary/${id}`)
  }
  cancelLoan(id: any): Observable<any> {
    return this.http.put(baseUrl + `Loan/CancelLoanRequest/${id}`,{})
  }
  createLoan(data: any): Observable<any> {

    return this.http.post(baseUrl + "Loan/AddLoan", data)
  }
  updateLoan(data: any): Observable<any> {

    return this.http.put(baseUrl + "Loan/UpdateLoan", data)
  }
  deleteLoan(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Loan/DeleteLoan/${id}`)
  }
  getAllTeamLoan(data: any): Observable<any> {

    return this.http.post(baseUrl + "Loan/GetAllTeamLoans", data)
  }

  updateRequestStage(data: any): Observable<any> {
    return this.http.put(baseUrl + "Stage/UpdateRequestStages", data)
  }

  getLoanReport(data: any): Observable<any> {
    return this.http.post(baseUrl + 'Loan/GetLoansReport', data);
  }

  getTeamLoanReport(data: any): Observable<any> {
    return this.http.post(baseUrl + 'Loan/GetTeamLoansReport', data);
  }

}
