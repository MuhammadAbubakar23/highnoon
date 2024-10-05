


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class HRPolicyService {
  constructor(private http: HttpClient) { }

  getPolicyDocuments(pageNumber: number, pageSize: number, text: String ): Observable<any> {
    return this.http.get(baseUrl + `HRPolicy/GetAllPolicyDocuments?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getPolicyDocumentsById(id: any): Observable<any> {
    return this.http.get(baseUrl + `HRPolicy/GetPolicyDocumentbyId/${id}`)
  }
  createPolicyDocuments(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "HRPolicy/AddPolicyDocument", data)
  }
  updatePolicyDocuments(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Location/UpdateLocation", data)
  }
  deletePolicyDocuments(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `HRPolicy/DeletePolicyDocument/${id}`)
  }
}
