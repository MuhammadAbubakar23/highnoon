import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DesignationService } from '../../services/designation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-create-designation',
  templateUrl: './create-designation.component.html',
  styleUrls: ['./create-designation.component.css']
})
export class CreateDesignationComponent implements OnInit {
  currentId: any = 0;
  designationForm = new FormGroup({
    title: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    grade:new FormControl('', [Validators.required,Validators.maxLength(100)]),
  });


  constructor(private _desS: DesignationService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  ngOnInit(): void {
    this.getDesignationDetails();
  }

  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Designations',
        tabs: [{ title: 'Create', url: 'connect/console/create-designation', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Roles',
        tabs: [{ title: 'Update', url: 'connect/console/update-designation', isActive: true }],
        isTab: false,
      })
    }
  }
  getDesignationDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update');
        this._desS.getDesignationById(this.currentId).subscribe((res) => {
          this.designationForm.patchValue(res.data)
        })
      }
    })
  }
  get dF() {
    return this.designationForm.controls
  }
  submitForm() {
    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.designationForm)
      const data = {
        id: this.currentId,
        title: this.designationForm.get('title').value,
        grade: this.designationForm.get('grade').value,
      }
      this._desS.updateDesignation(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Designation Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/designations']);
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
        title: this.designationForm.get('title').value,
        grade:this.designationForm.get('grade').value
      }
      this._desS.createDesignation(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Designation Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/designations']);
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
