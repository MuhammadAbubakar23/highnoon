import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class ImportantLinksService {
  constructor(private http: HttpClient) { }

  getImportantLinks(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `HRPolicy/GetAllImportantLinks?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getImportantLinkById(id: any): Observable<any> {
    return this.http.get(baseUrl + `HRPolicy/GetImportantLinkById/${id}`)
  }
  createImportantLink(data: any): Observable<any> {

    return this.http.post(baseUrl + "HRPolicy/AddImportantLink", data)
  }
  updateImportantLink(data: any): Observable<any> {

    return this.http.put(baseUrl + "HRPolicy/UpdateImportantLink", data)
  }
  deleteImportantLink(id: any): Observable<any> {
    return this.http.delete(baseUrl + `HRPolicy/DeleteImportantLink/${id}`)
  }
  GetImportantLinks(): Observable<any> {
    return this.http.get(baseUrl + `Dashboard/GetImportantLinks`)
  }
}