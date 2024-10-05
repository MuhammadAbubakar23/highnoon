import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class ExpenseTypeService {
  constructor(private http: HttpClient) { }

  getExpenseTypes(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(baseUrl + `ExpenseTypes/GetAllExpenseTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getExpenseTypeById(id: any): Observable<any> {
    return this.http.get(baseUrl + `ExpenseTypes/GetExpenseTypeById/${id}`)
  }
  createExpenseType(data: any): Observable<any> {

    return this.http.post(baseUrl + "ExpenseTypes/AddExpenseType", data)
  }
  updateExpenseType(data: any): Observable<any> {

    return this.http.post(baseUrl + "ExpenseTypes/UpdateExpenseType", data)
  }
  deleteExpenseType(id: any): Observable<any> {
    return this.http.delete(baseUrl + `ExpenseTypes/DeleteExpenseType/${id}`)
  }
}
