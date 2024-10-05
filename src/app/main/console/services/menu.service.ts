import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getMenus(pageNumber: number, pageSize: number, text: String ): Observable<any> {
    return this.http.get(baseUrl + `Menu/GetAllMenus?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}
    `)
  }

  getMenuById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Menu/GetMenuById/${id}`)
  }
  createMenu(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Menu/AddMenu", data)
  }
  updateMenu(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Menu/UpdateMenu", data)
  }
  deleteMenu(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `Menu/DeleteMenu/${id}`)
  }
}

