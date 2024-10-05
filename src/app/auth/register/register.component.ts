import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { User } from 'src/app/shared/models/user';
import { AuthService } from '../authService/auth.service';
import { CustomValidators } from 'src/app/validators/custom.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  showregAccount: boolean = true;
  showMoreInfo: boolean = false;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  register: User = new User();
  Cities: any;
  selectedCity: any;

  statusCode!: number
  constructor(private _aS: AuthService,
    private router: Router,
    private _toastS: ToasterService
    // private toast: ToastrService,

  ) {
    console.log(this.selectedCity);
  }

  registerForm = new FormGroup({
    userName: new FormControl(this.register.userName, [Validators.required]),
    firstName: new FormControl(this.register.firstName, [Validators.required]),
    lastName: new FormControl(this.register.lastName, [Validators.required]),
    email: new FormControl(this.register.email, [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
    phoneNumber: new FormControl(this.register.phoneNumber, [Validators.required]),
    password: new FormControl(this.register.password, [Validators.required]),
    // ConfirmPassword: new FormControl(this.register.ConfirmPassword, [Validators.required]),}, [CustomValidators.MatchValidator('Password', 'ConfirmPassword')]
  });

  ngOnInit(): void {

  }
  get passwordMatchError() {
    return (
      this.registerForm.getError('mismatch') &&
      this.registerForm.get('ConfirmPassword')?.touched
    );
  }

  toggle() {
    if (this.showregAccount) {
      this.showregAccount = false;
      this.showMoreInfo = true;
    }
  }

  get rF() {
    return this.registerForm.controls;
  }


  onSubmit() {

    console.log("onSubmit", this.registerForm.value);
    const registerData = this.registerForm.value
    this._aS.signUp(registerData).subscribe((res: any) => {
      if(res.statusCode == 200) {

        this.router.navigateByUrl("/auth/login");
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Success", toastParagrahp: "User Created Successfully!" }
        this._toastS.updateToastData(toasterObject)
        setTimeout(() => {
          const toasterObject = { isShown: false, toastHeading: "", toastParagrahp: "" }
          this._toastS.updateToastData(toasterObject)
        }, 3000);
      }
      if(res.statusCode == 400) {
        
        const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: res.error }
        this._toastS.updateToastData(toasterObject)
        setTimeout(() => {
          const toasterObject = { isShown: false, toastHeading: "", toastParagrahp: "" }
          this._toastS.updateToastData(toasterObject)
        }, 3000);
      }

    }, (error: any) => {
      console.error("Internal Server Error", error);
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      setTimeout(() => {
        const toasterObject = { isShown: false, toastHeading: "", toastParagrahp: "" }
        this._toastS.updateToastData(toasterObject)
      }, 2000);
    });
  }

}
