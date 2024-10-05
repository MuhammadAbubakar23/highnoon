import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeTypeService } from '../../services/employee-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-create-employee-type',
  templateUrl: './create-employee-type.component.html',
  styleUrls: ['./create-employee-type.component.css']
})
export class CreateEmployeeTypeComponent {
  currentId: any = 0;
  employeeTypeForm = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.maxLength(100)]),
  });


  constructor(private _empTS: EmployeeTypeService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _hS: HeaderService) {

    this.changeHeader('create');

  }
  ngOnInit(): void {
    
    this.getEmployeeTypeDetails();
  }
  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Employee Type',
        tabs: [{ title: 'Create', url: 'connect/console/create-employee-type', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Employee Type',
        tabs: [{ title: 'Update', url: 'connect/console/update-employee-type', isActive: true }],
        isTab: false,
      })
    }
  }
  getEmployeeTypeDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._empTS.getEmplyeeTypeById(this.currentId).subscribe((res) => {
          console.log(res.data);
          this.employeeTypeForm.patchValue({
            name: res.data.typeName,
          })
        })
      }
    })
  }
  get eTF() {
    return this.employeeTypeForm.controls
  }
  submitForm() {
    

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.employeeTypeForm)
      const data = {
        id: this.currentId,
        name: this.employeeTypeForm.get('name').value,
        // isActive: this.employeeTypeForm.get('isActive').value
      }
      this._empTS.updateEmplyeeType(data).subscribe((res) => {

        if (res.statusCode === 200) {

          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "EmployeeType Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/employee-type']);

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
        name: this.employeeTypeForm.get('name').value,
        // isActive: this.employeeTypeForm.get('isActive').value
      }
      this._empTS.createEmplyeeType(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "EmployeeType Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/employee-type']);
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
