import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class PaySlipService {
  constructor(private http: HttpClient) { }

  getPayslip(data): Observable<any> {

    return this.http.post(baseUrl + "SalarySlips/GetSalarySlip", data)
  }
  getPayslipById(id: number): Observable<any> {
    return this.http.get(baseUrl + `SalarySlips/GetSalaryById/${id}`)
  }

  getPayslipPdf(id: number): Observable<any> {
    return this.http.get(baseUrl + `SalarySlips/GetSalaryPdf/${id}`)
  }
  salarySlipSendOtpByEmail(id: any): Observable<any> {
    return this.http.post(baseUrl + `SalarySlips/SendOtpByEmail?userId=${id}`, {})
  }
  salarySlipsVerifyOtp(id: number, otp: string): Observable<any> {
    return this.http.post(baseUrl + `SalarySlips/VerifyOtp?otp=${otp}&userId=${id}`, {})
  }

}
