import { Component } from '@angular/core';
import { AvailableMedicineService } from '../../services/available-medicine.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-create-available-medicine',
  templateUrl: './create-available-medicine.component.html',
  styleUrls: ['./create-available-medicine.component.css']
})
export class CreateAvailableMedicineComponent {
  currentId: any = 0;
  availableMedicineForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    marketPrice: new FormControl(0, [Validators.required]),
  });
  constructor(private _availableMedicineS: AvailableMedicineService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Available Medicine',
        tabs: [{ title: 'Create', url: 'connect/console/create-available-medicine', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Available Medicine',
        tabs: [{ title: 'Update', url: 'connect/console/update-available-medicine', isActive: true }],
        isTab: false,
      })
    }
  }
  ngOnInit(): void {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update');
        this._availableMedicineS.getAvailableMedicineById(this.currentId).subscribe((res) => {
          
          this.availableMedicineForm.patchValue({
            name: res.data.name,
            marketPrice: res.data.marketPrice
          })
        })
      }
    })
  }

  get aMF() {
    return this.availableMedicineForm.controls
  }
  submitForm() {

    if (this.currentId !== 0 && this.currentId !== undefined) {

      const data = {
        "availableMedicineId":this.currentId,
        "name":this.availableMedicineForm.get('name').value,
        "marketPrice": this.availableMedicineForm.get('marketPrice').value
      }
      this._availableMedicineS.updateAvailableMedicine(data).subscribe((res) => {

        if (res.statusCode === 200) {

          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Medicine Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/available-medicine']);
          this._toastS.hide();
        }

      }, (error: any) => {
        console.error("Internal Server Error", error);
        const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      })
    }
    else {
      const data = {
        "availableMedicineId":0,
        "name":this.availableMedicineForm.get('name').value,
        "marketPrice": this.availableMedicineForm.get('marketPrice').value
      }
      this._availableMedicineS.addAvailableMedicine(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Medicine  Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/available-medicine']);
          this._toastS.hide();
        }
      }, (error: any) => {
        console.error("Internal Server Error", error);
        const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      })

    }
  }
}


