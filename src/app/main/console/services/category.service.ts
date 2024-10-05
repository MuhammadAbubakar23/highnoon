import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  getCategory(pageNumber: number, pageSize: number, text: String ): Observable<any> {
    return this.http.get(baseUrl + `Category/GetAllCategories?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }
  getCategoryById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Category/GetCategoryById/${id}`)
  }
  createCategory(data: any): Observable<any> {
    
    return this.http.post(baseUrl + "Category/AddCategory", data)
  }
  updateCategory(data: any): Observable<any> {
    
    return this.http.put(baseUrl + "Category/UpdateCategory", data)
  }
  deleteCategory(id: any): Observable<any> {
    
    return this.http.delete(baseUrl + `Category/DeleteCategory/${id}`)
  }
}
