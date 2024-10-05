import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { ShiftService } from '../../services/shift.service';
import { CustomValidators } from 'src/app/validators/custom.validators';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-create-shift',
  templateUrl: './create-shift.component.html',
  styleUrls: ['./create-shift.component.css']
})
export class CreateShiftComponent {
  currentId: any = 0;
  locations: any;
  shiftForm = new FormGroup({
    scheduleName: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    scheduleId: new FormControl(null),
    checkInDateTime: new FormControl(null, [Validators.required,Validators.maxLength(100)]),
    checkOutDateTime: new FormControl(null, [Validators.required,Validators.maxLength(100)]),
    breakInTime: new FormControl(null, [Validators.required,Validators.maxLength(100)]),
    breakOutTime: new FormControl(null, [Validators.required,Validators.maxLength(100)]),
    location: new FormControl(null, [Validators.required])
  });


  constructor( private _sS: ShiftService,  private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService,private _hS:HeaderService, private _dropdownS: DropDownApiService) {
    this.changeHeader('create');


  }
  ngOnInit(): void {
    this.getLocations();
this.getshiftDetails();

  }
  changeHeader(title:string){
    if(title ==='create'){
      this._hS.updateHeaderData({
        title: 'Schedule',
        tabs: [{ title: 'Create', url: 'connect/console/create-schedule', isActive: true }],
        isTab: false,
      })
    }
    else{
      this._hS.updateHeaderData({
        title: 'Shift',
        tabs: [{ title: 'Update', url: 'connect/console/update-shift', isActive: true }],
        isTab: false,
      })
    }
  }
  getshiftDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._sS.getShiftById(this.currentId).subscribe((res) => {
          this.shiftForm.patchValue({
            scheduleName: res.data.shiftName,
            checkInDateTime: res.data.checkIN,
            checkOutDateTime: res.data.checkOut,
            breakInTime: res.data.breakIN,
            breakOutTime: res.data.breakOut,
            location: res.data.location
            // isActive:res.data.isActive
          })
        })
      }
    })
  }
  get csf() {
    return this.shiftForm.controls
  }
  getLocations() {
    this._dropdownS.getLocationsforDDD().subscribe((res) => {
      this.locations = res.data;
    })
  }
  submitForm() {
debugger
    let checkInDateTime = this.shiftForm.get('checkInDateTime').value;
    let checkOutDateTime = this.shiftForm.get('checkOutDateTime').value;
    let breakInTime = this.shiftForm.get('breakInTime').value;
    let breakOutTime = this.shiftForm.get('breakOutTime').value;
    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.shiftForm)
      const data = {
        scheduleId: this.currentId,
        scheduleName: this.shiftForm.get('scheduleName').value,
        // isActive: this.shiftForm.get('isActive').value
        checkInDateTime: this.shiftForm.get('checkInDateTime').value,
        checkOutDateTime: this.shiftForm.get('checkOutDateTime').value,
        breakInTime: this.shiftForm.get('breakInTime').value,
        breakOutTime: this.shiftForm.get('breakOutTime').value,
        location: this.shiftForm.get('location').value
      }
      this._sS.updateShift(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess:true, toastHeading: "Updated", toastParagrahp: "Shift Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/schedule']);
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
        scheduleId: 0,
        scheduleName: this.shiftForm.get('scheduleName').value,
        //isActive: this.shiftForm.get('isActive').value
        checkInDateTime: this.shiftForm.get('checkInDateTime').value,
        checkOutDateTime: this.shiftForm.get('checkOutDateTime').value,
        breakInTime: this.shiftForm.get('breakInTime').value,
        breakOutTime: this.shiftForm.get('breakOutTime').value,
        location: this.shiftForm.get('location').value,
      }
      this._sS.createShift(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Shift Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/schedule']);
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

  addCustomValidatorCheck() {
    const checkOutDateTime = this.shiftForm.get('checkOutDateTime').value;
    if (checkOutDateTime !== null) {
      this.shiftForm.setValidators(
        CustomValidators.dateValidatorforAttendance('checkInDateTime', 'checkOutDateTime')
      );
      this.shiftForm.updateValueAndValidity();
    }
  }

  get isCheckoutGreater(): boolean {
    return (
      this.shiftForm.getError('invalidDate') &&
      this.shiftForm.get('checkOutDateTime').touched
    );
  }

  get isBreakoutGreater(): boolean {
    return (
      this.shiftForm.getError('invalidDatee') &&
      this.shiftForm.get('breakOutTime').touched
    );
  }

  // addCustomValidatorbreak() {
  //   const breakOutTime = this.shiftForm.get('breakOutTime').value;
  //   if (breakOutTime !== null) {
  //     this.shiftForm.setValidators(
  //       CustomValidators.dateValidatorforShift('breakInTime', 'breakOutTime')
  //     );
  //     this.shiftForm.updateValueAndValidity();
  //   }
  // }


}
