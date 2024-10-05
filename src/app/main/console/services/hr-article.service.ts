

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class HRArticleService {
  constructor(private http: HttpClient) { }

  getAllArticles(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `HRPolicy/GetAllPolicyArticles?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getArticleById(id: any): Observable<any> {
    return this.http.get(baseUrl + `HRPolicy/GetPolicyArticlebyId/${id}`)
  }
  createArticle(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "HRPolicy/AddPolicyArticle", data)
  }
  updateArticle(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "HRPolicy/UpdatePolicyArticle", data)
  }
  deleteArticle(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `HRPolicy/DeletePolicyArticle/${id}`)
  }
}
