import { Component } from '@angular/core';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { BenefitTypeService } from '../../services/benefit-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-create-benefit-type',
  templateUrl: './create-benefit-type.component.html',
  styleUrls: ['./create-benefit-type.component.css']
})
export class CreateBenefitTypeComponent {
  currentId: any = 0;
  benefitTypeForm = new FormGroup({
    type: new FormControl('', [Validators.required]),
  });
  constructor(private _benefitTypeS: BenefitTypeService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Benefit Type',
        tabs: [{ title: 'Create', url: 'connect/console/create-benefit-type', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Benefit Type',
        tabs: [{ title: 'Update', url: 'connect/console/update-benefit-type', isActive: true }],
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
        this._benefitTypeS.getBenefitTypeById(this.currentId).subscribe((res) => {
          this.benefitTypeForm.patchValue({
            type: res.data.type,
          })
        })
      }
    })
  }

  get bTF() {
    return this.benefitTypeForm.controls
  }
  submitForm() {

    if (this.currentId !== 0 && this.currentId !== undefined) {

      const data = {
        "benefitTypeId": this.currentId,
        "type": this.benefitTypeForm.get('type').value
      }
      this._benefitTypeS.updateBenefitType(data).subscribe((res) => {

        if (res.statusCode === 200) {

          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Benefit Type Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/benefit-type']);
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
        "benefitTypeId": 0,
        "type": this.benefitTypeForm.get('type').value
      }
      this._benefitTypeS.addBenefitType(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Benefit Type Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/benefit-type']);
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


