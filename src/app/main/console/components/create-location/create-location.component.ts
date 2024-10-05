import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.css']
})
export class CreateLocationComponent {
  currentId: any = 0;
  locationForm = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    isActive: new FormControl(false),
  });


  constructor(private _locS: LocationService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService,private _hS:HeaderService) {
    this.changeHeader('create');


  }
  ngOnInit(): void {
this.getLocationDetails();

  }
  changeHeader(title:string){
    if(title ==='create'){
      this._hS.updateHeaderData({
        title: 'Locations',
        tabs: [{ title: 'Create', url: 'connect/console/create-location', isActive: true }],
        isTab: false,
      })
    }
    else{
      this._hS.updateHeaderData({
        title: 'Locations',
        tabs: [{ title: 'Update', url: 'connect/console/update-location', isActive: true }],
        isTab: false,
      })
    }
  }
  getLocationDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._locS.getLocationById(this.currentId).subscribe((res) => {
          this.locationForm.patchValue({
            name: res.data.name,
            // isActive:res.data.isActive
          })
        })
      }
    })
  }
  get lF() {
    return this.locationForm.controls
  }
  submitForm() {
    

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.locationForm)
      const data = {
        id: this.currentId,
        name: this.locationForm.get('name').value,
        // isActive: this.locationForm.get('isActive').value
      }
      this._locS.updateLocation(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Location Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/locations']);
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
        name: this.locationForm.get('name').value,
        //isActive: this.locationForm.get('isActive').value
      }
      this._locS.createLocation(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Location Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/locations']);
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
