import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private http: HttpClient) { }

  getRoles(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `Roles/GetAllRoles?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getRoleById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Roles/GetRoleById/${id}`)
  }

  getRolesByUserId(id: any): Observable<any> {
    return this.http.get(baseUrl + `Roles/GetRolesByUserId/${id}`)
  }

  createRole(data: any): Observable<any> {

    return this.http.post(baseUrl + "Roles/AddRole", data)
  }
  updateRole(data: any): Observable<any> {

    return this.http.put(baseUrl + "Roles/UpdateRole", data)
  }
  deleteRole(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Roles/DeleteRole/${id}`)
  }
  addEmployRole(data: any): Observable<any> {
    
    return this.http.post(baseUrl + 'Roles/AddUserRoles',data)
  }
  getPermissionsByRoleId(id: any): Observable<any> {
    return this.http.get(baseUrl + `Permission/GetAllPermissionsByRoleId/${id}`)
  }
  addPermissionForRole(data: any): Observable<any> {
    return this.http.post(baseUrl + 'Permission/AddPermissionForRole',data)
  }

}
