
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class DependentService {


  constructor(private http: HttpClient) { }

  // getCategory(): Observable<any> {
  //   return this.http.get(baseUrl + "Category/GetAllCategories")
  // }
  getDependantByEmployeeId(id: any): Observable<any> {
    return this.http.get(baseUrl + `Dependant/GetDependantByEmployeeId/${id}`)
  }
  getDependantById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Dependant/GetDependantById/${id}`)
  }
  addDependant(data: any): Observable<any> {

    return this.http.post(baseUrl + "Dependant/AddDependant", data)
  }
  updateDependant(data: any): Observable<any> {
    return this.http.put(baseUrl + "Employee/UpdateDependent", data)
  }
  deleteDependant(id: any): Observable<any> {
    return this.http.delete(baseUrl + `Dependant/DeleteDependant/${id}`)
  }

}

