import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class LoanTypeService {
  constructor(private http: HttpClient) { }

  getLoanType(pageNumber: number, pageSize: number, text: String ): Observable<any> {
    return this.http.get(baseUrl + `LoanType/GetAllLoanTypes?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}
    `)
  }
  getLoanTypeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `LoanType/GetLoanTypeById/${id}`)
  }
  createLoanType(data: any): Observable<any> {

    return this.http.post(baseUrl + "LoanType/AddLoanTypes", data)
  }
  updateLoanType(data: any): Observable<any> {

    return this.http.put(baseUrl + "LoanType/UpdateLoanType", data)
  }
  deleteLoanType(id: any): Observable<any> {

    return this.http.delete(baseUrl + `LoanType/DeleteLoanType/${id}`)
  }
}
