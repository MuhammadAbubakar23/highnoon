import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
const baseUrl = environment.baseUrl;
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JsonPipe } from '@angular/common';
@Injectable({
  providedIn: 'root',
})

export class AuthService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  constructor(private http: HttpClient, public router: Router) { }
  // Sign-up
  signUp(user: any): Observable<any> {

    let api = baseUrl + 'Auth/Registeration';
    return this.http.post(api, user)
  }
  // Sign-in
  signIn(user: any) {


    return this.http.post<any>(baseUrl + 'Auth/UserLogin', user)
  }
  refreshToken(user: any) {

    return this.http.post<any>(baseUrl + 'Auth/UserLogin', user)
    // .subscribe((res: any) => {
    //   localStorage.setItem('access_token', res.token);
    //   this.getUserProfile(res._id).subscribe((res) => {
    //     this.currentUser = res;
    //     this.router.navigate(['user-profile/' + res.msg._id]);
    //   });
    // });
  }
  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['auth/login']);
    }
  }
  // User profile
  getUserProfile(id: any): Observable<any> {
    let api = `${baseUrl}+'`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }
  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  decodeToken(token) {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      JSON.parse(decodedToken.Permissions);
      //console.log("JSON.parse(decodedToken.Menus)", JSON.parse(decodedToken.Menus))
      localStorage.setItem('Menus', decodedToken.Menus);
      localStorage.setItem('Permissions', decodedToken.Permissions);
      localStorage.setItem('userId', JSON.parse(decodedToken.nameid))
      localStorage.setItem('designationId', JSON.parse(decodedToken.DesignationId))
      localStorage.setItem('username', decodedToken.name);
      localStorage.setItem('initial', decodedToken.initial)

      localStorage.setItem('Roles', decodedToken.Roles)
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
}
