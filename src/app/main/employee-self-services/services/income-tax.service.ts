import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})

export class IncomeTaxService {
  constructor(private http: HttpClient) { }

  getIncomeTax(data): Observable<any> {

    return this.http.post(baseUrl + "Tax/GetIncomeTax", data)
  }
  getIncomeTaxById(id): Observable<any> {
    return this.http.get(baseUrl + `Tax/GetTaxDetail/${id}`)
  }
  getIncomeTaxPdf(id): Observable<any> {
    return this.http.get(baseUrl + `Tax/GetIncomeTaxPdf/${id}`)
  }

}
