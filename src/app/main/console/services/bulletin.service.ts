import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class BulletinService {

  constructor(private http: HttpClient) { }
  getAllBulletin(pageNumber: number, pageSize: number, text: String): Observable<any> {
    
    return this.http.get(baseUrl + `Bulletin/GetAllBulletin?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  createBulletin(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Bulletin/AddBulletin", data)
  }
  updateBulletin(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Bulletin/UpdateBulletin", data)
  }
  deleteBulletin(id): Observable<any> {
    return this.http.delete(baseUrl + `Bulletin/DeleteBulletIn/${id}`)
  }
  getBulletinById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Bulletin/GetBulletinById/${id}`)
  }
}
