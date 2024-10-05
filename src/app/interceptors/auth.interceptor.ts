import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { AuthService } from "../auth/authService/auth.service";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  //{ headers: { 'Content-Type': 'multipart/form-data' }
  constructor(private authService: AuthService, private _r: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
//http://recruitment-staging.highnoon.com.pk:3000/api/job/list
    if (req.url.endsWith("/Auth/UserLogin") || req.url.endsWith("/Auth/Registeration" ) || req.url.endsWith("/job/list" )) {
      return next.handle(req);
    }
    const authToken = this.authService.getToken();
    if (authToken) {
      try {
        let decodedToken = jwtDecode(authToken);
        console.log("decodedToken.exp", decodedToken.exp)
        const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;
        console.log("isExpired", isExpired);
        if (isExpired) {
          console.log("token expired");
          this.authService.doLogout();
          this._r.navigateByUrl('/auth/login');
        }
        else {
          console.log("token not expired");
        }
      }
      catch (e) {
        console.log("Invalid token")
        this.authService.doLogout();
        this._r.navigateByUrl('/auth/login');
      }
    }
    else {
      console.log("No token found");
      this._r.navigateByUrl('/auth/login');
    }
    req = req.clone({
      setHeaders: {
        Authorization: authToken
      }
    });
    return next.handle(req);
  }
}
