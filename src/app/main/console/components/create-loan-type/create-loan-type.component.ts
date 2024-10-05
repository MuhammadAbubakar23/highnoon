import { Component } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { LoanTypeService } from '../../services/loan-type.service';

@Component({
  selector: 'app-create-loan-type',
  templateUrl: './create-loan-type.component.html',
  styleUrls: ['./create-loan-type.component.css']
})
export class CreateLoanTypeComponent {
  currentId: any = 0;
  loanTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.maxLength(100)]),
  });


  constructor(private _loanTS: LoanTypeService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService,private _hS:HeaderService) {
    this.changeHeader('create');


  }
  ngOnInit(): void {
this.getLoanTypeDetails();

  }
  changeHeader(title:string){
    if(title ==='create'){
      this._hS.updateHeaderData({
        title: 'Loan Type',
        tabs: [{ title: 'Create', url: 'connect/console/create-loan-type', isActive: true }],
        isTab: false,
      })
    }
    else{
      this._hS.updateHeaderData({
        title: 'Loan Type',
        tabs: [{ title: 'Update', url: 'connect/console/update-loan-type', isActive: true }],
        isTab: false,
      })
    }
  }
  getLoanTypeDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._loanTS.getLoanTypeById(this.currentId).subscribe((res) => {
          this.loanTypeForm.patchValue({
            name: res.data.name,
          })
        })
      }
    })
  }
  get lF() {
    return this.loanTypeForm.controls
  }
  submitForm() {
    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.loanTypeForm)
      const data = {
        id: this.currentId,
        name: this.loanTypeForm.get('name').value,
      }
      this._loanTS.updateLoanType(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Loan Type Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/loan-type']);
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
        name: this.loanTypeForm.get('name').value,
      }
      this._loanTS.createLoanType(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Loan Type Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/loan-type']);
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
