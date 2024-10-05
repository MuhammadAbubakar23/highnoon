import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { LeaveStatusService } from '../../services/leave-status.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-create-leave-status',
  templateUrl: './create-leave-status.component.html',
  styleUrls: ['./create-leave-status.component.css']
})
export class CreateLeaveStatusComponent {
  currentId: any = 0;
  leaveStatusForm = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    description: new FormControl('',[Validators.required,Validators.maxLength(200)]),
  });


  constructor(private _leaveStatusS: LeaveStatusService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService ,private _hS:HeaderService) {
    this.changeHeader('create');
  }
  ngOnInit(): void {
    this.getLeaveStatusDetails();
  }
  changeHeader(title:string){
    if(title ==='create'){
      this._hS.updateHeaderData({
        title: 'Leave Status',
        tabs: [{ title: 'Create', url: 'connect/console/create-leave-status', isActive: true }],
        isTab: false,
      })
    }
    else{
      this._hS.updateHeaderData({
        title: 'Leave Status',
        tabs: [{ title: 'Update', url: 'connect/console/update-leave-status', isActive: true }],
        isTab: false,
      })
    }
  }
  getLeaveStatusDetails(){
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._leaveStatusS.getLeaveStatusById(this.currentId).subscribe((res) => {
          console.log(res.data);
          this.leaveStatusForm.patchValue({
            name: res.name,
            description:res.description
          })
        })
      }
    })
  }
  get lSF() {
    return this.leaveStatusForm.controls
  }
  submitForm() {
    

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.leaveStatusForm)
      const data = {
        leaveStatusId: this.currentId,
        name: this.leaveStatusForm.get('name').value,
        description:this.leaveStatusForm.get('description').value,
        // isActive: this.locationForm.get('isActive').value
      }
      this._leaveStatusS.updateLeaveStatus(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Leave Status Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/leave-status']);
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
        leaveStatusId: 0,
        name: this.leaveStatusForm.get('name').value,
        description:this.leaveStatusForm.get('description').value,
      }
      this._leaveStatusS.createLeaveStatus(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Leave Status Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/leave-status']);
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

