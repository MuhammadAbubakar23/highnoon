import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  show: boolean = true;
  showVerify: boolean = false;
  showVerifyCode: boolean = false;
  showResetPassword: boolean = false;
  constructor() { }
  ngOnInit(): void {
  }
  toogle() {
    // ;
    if (this.show) {
      this.show = false;
      this.showVerify = true;
    } else if (this.showVerify) {
      this.showVerify = false;
      this.showVerifyCode = true;
    } else if (this.showVerifyCode) {
      this.showVerifyCode = false;
      this.showResetPassword = true;
    }
  }
  toogleBack() {
   
    if (this.showVerify) {
      this.showVerify = false;
      this.show = true;
    } else if (this.showVerifyCode) {
      this.showVerifyCode = false;
      this.showVerify = true;
    } else if (this.showResetPassword) {
      this.showResetPassword = false;
      this.showVerifyCode = true;
    }
  }
}
