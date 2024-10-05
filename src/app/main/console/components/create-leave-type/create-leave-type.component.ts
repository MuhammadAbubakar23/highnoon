import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { LeaveTypeService } from '../../services/leave-type.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-create-leave-type',
  templateUrl: './create-leave-type.component.html',
  styleUrls: ['./create-leave-type.component.css']
})
export class CreateLeaveTypeComponent {
  currentId: any = 0;
  leaveTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    availability:new FormControl(0,[Validators.required]),
    description: new FormControl('',[Validators.required,Validators.maxLength(200)]),
  });


  constructor(private _leavetypeS: LeaveTypeService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService ,private _hS:HeaderService) {
this.changeHeader('create');

  }
  ngOnInit(): void {
    this.getLeaveTypeDetails();

  }
  changeHeader(title:string){
    if(title ==='create'){
      this._hS.updateHeaderData({
        title: 'Leave Type',
        tabs: [{ title: 'Create', url: 'connect/console/create-type', isActive: true }],
        isTab: false,
      })
    }
    else{
      this._hS.updateHeaderData({
        title: 'Leave Type',
        tabs: [{ title: 'Update', url: 'connect/console/update-create-type', isActive: true }],
        isTab: false,
      })
    }
  }
  getLeaveTypeDetails() {
    this._aR.params.subscribe((params) => {
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update');
        this._leavetypeS.getLeaveTypeById(this.currentId).subscribe((res) => {

          this.leaveTypeForm.patchValue({
            name: res.data.name,
            description:res.data.description,
            availability:res.data.availability
          })
        })
      }
    })
  }
  get lTF() {
    return this.leaveTypeForm.controls
  }
  submitForm() {
    

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.leaveTypeForm)
      const data = {
        leaveTypeId: this.currentId,
        name: this.leaveTypeForm.get('name').value,
        availability:this.leaveTypeForm.get('availability').value,
        description:this.leaveTypeForm.get('description').value,
      }
      this._leavetypeS.updateLeaveType(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Leave Type Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/leave-type']);
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
        leaveTypeId: 0,
        name: this.leaveTypeForm.get('name').value,
        availability:this.leaveTypeForm.get('availability').value,
        description:this.leaveTypeForm.get('description').value,
      }
      this._leavetypeS.createLeaveType(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Leave Type Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/leave-type']);
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

