import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { EmployerService } from '../../services/employer.service';
import { HeaderService } from 'src/app/services/header.service';


@Component({
  selector: 'app-create-employer',
  templateUrl: './create-employer.component.html',
  styleUrls: ['./create-employer.component.css']
})
export class CreateEmployerComponent {
  currentId: any = 0;
  employerForm = new FormGroup({
    employerName: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    isActive: new FormControl(false),
  });


  constructor(private _emprS: EmployerService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _hS: HeaderService) {
    this.changeHeader('create')


  }
  ngOnInit(): void {
    this.getEmployerDetails();
  }
  changeHeader(title:string){
    if(title ==='create'){
      this._hS.updateHeaderData({
        title: 'Employer',
        tabs: [{ title: 'Create', url: 'connect/console/create-employer', isActive: true }],
        isTab: false,
      })
    }
    else{
      this._hS.updateHeaderData({
        title: 'Employer',
        tabs: [{ title: 'Update', url: 'connect/console/update-employer', isActive: true }],
        isTab: false,
      })
    }
  }
  getEmployerDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this._emprS.getEmployerById(this.currentId).subscribe((res) => {
          this.employerForm.patchValue({
            employerName: res.data.employerName,
          })
        })
      }
    })
  }
  get erF() {
    return this.employerForm.controls
  }
  submitForm() {
    

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.employerForm)
      const data = {
        id: this.currentId,
        employerName: this.employerForm.get('employerName').value,

      }
      this._emprS.updateEmployer(data).subscribe((res) => {

        if (res.statusCode === 200) {

          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Employer Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/employer']);

          this._toastS.hide();
        }

      }, (error: any) => {
        console.error("Internal Server Error", error);
        const toasterObject = { isShown: true,isSuccess:false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      })

    }
    else {
      const data = {
        id: 0,
        employerName: this.employerForm.get('employerName').value,
      }
      this._emprS.createEmployer(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Employer Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/employer']);
          this._toastS.hide();
        }
      }, (error: any) => {
        console.error("Internal Server Error", error);
        const toasterObject = { isShown: true,isSuccess:false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      })

    }
  }
}


