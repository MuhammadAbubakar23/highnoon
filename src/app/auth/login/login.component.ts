import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { AuthService } from '../authService/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: User = new User();
  token: any;
  show = false;

  loginForm = new FormGroup({
    userName: new FormControl(this.login.userName, [Validators.required]),
    password: new FormControl(this.login.password, [Validators.required])
  })

  constructor(private _aS: AuthService,
    private router: Router, private _toastS: ToasterService
  ) { }

  ngOnInit(): void {

  }

  loginguser: any;
  userloginname: any;

  get lF() {
    return this.loginForm.controls;
  }
  onSubmit() {

    const loginData = {
      userName: this.loginForm.get('userName').value,
      password: this.loginForm.get('password').value
    };
    this._aS.doLogout();
    this._aS.signIn(loginData).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          
          console.log("Login response:", res);
          localStorage.setItem('access_token', res.data);
          const decodeToken = this._aS.decodeToken(res.data);
          console.log(decodeToken);
          this.router.navigateByUrl('/connect/dashborad');
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Success", toastParagrahp: "Login Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        }
        if (res.statuscode === 400) {
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Inavlid Username or Password!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
          this.router.navigateByUrl('/auth/login');
        }

      }, (error: any) => {
        console.error("Internal Server Error", error);
        const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      });

  }

  password() {
    this.show = !this.show;
  }

}
