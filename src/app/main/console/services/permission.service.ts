import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private http: HttpClient) { }

  getPermissions(pageNumber: number, pageSize: number, text: String ): Observable<any> {
    return this.http.get(baseUrl + `Permission/GetAllPermissions?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}
    `)
  }
  getPermissionById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Permission/GetPermissionById/${id}`)
  }
  createPermission(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Permission/AddPermission", data)
  }
  updatePermission(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Permission/UpdatePermission", data)
  }
  deletePermission(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `Permission/DeletePermission/${id}`)
  }
}
