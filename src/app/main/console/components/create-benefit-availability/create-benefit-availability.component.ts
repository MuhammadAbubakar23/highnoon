import { Component } from '@angular/core';
import { DesignationService } from '../../services/designation.service';
import { BenefitAvailabilityService } from '../../services/benefit-availability.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-create-benefit-availability',
  templateUrl: './create-benefit-availability.component.html',
  styleUrls: ['./create-benefit-availability.component.css']
})
export class CreateBenefitAvailabilityComponent {
  currentId: any = 0;
  designations: any = [];
  benefits: any = [];
  isMultiple: boolean = true;
  selectedDesignation: any = [];
  benefitAvailabilityForm = new FormGroup({
    limit: new FormControl(0, [Validators.required]),
    unit: new FormControl('', [Validators.required]),
    benefitTypeId: new FormControl(0, [Validators.required]),
    designationId: new FormControl([], [Validators.required])
  });
  constructor(private _benefitAvailS: BenefitAvailabilityService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  changeHeader(title: string) {
    if (title === 'create') {
      this.isMultiple = true;
      this._hS.updateHeaderData({
        title: 'Benefit Availability',
        tabs: [{ title: 'Create', url: 'connect/console/create-benefit-availability', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Benefit Availability',
        tabs: [{ title: 'Update', url: 'connect/console/update-benefit-availability', isActive: true }],
        isTab: false,
      })
    }
  }
  ngOnInit(): void {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.isMultiple = false;
        this.changeHeader('update')
        this._benefitAvailS.getBenefitAvailabilityById(this.currentId).subscribe((res) => {
          this.benefitAvailabilityForm.patchValue(res.data);
          this.benefitAvailabilityForm.get('designationId').setValue(res.data.designationId)
        })
      }
    })
    this._DDS.getDesignationForDD().subscribe((res) => {
      this.designations = res.data;

    })
    this._DDS.getBenefitTypeForDD().subscribe((res) => {
      this.benefits = res.data;

    })
  }

  get bAF() {
    return this.benefitAvailabilityForm.controls
  }
  submitForm() {

    let selectedDesignation = this.benefitAvailabilityForm.get('designationId').value;

    if (this.currentId === undefined) {
      this.currentId = 0;
    }



    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = {
        'benefitAvailablityId': this.currentId,
        'limit': this.benefitAvailabilityForm.get('limit').value,
        'unit': this.benefitAvailabilityForm.get('unit').value,
        'benefitTypeId': this.benefitAvailabilityForm.get('benefitTypeId').value,
        'designationId': selectedDesignation
      };
      this._benefitAvailS.updateBenefitAvailability(data).subscribe((res) => {
        
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Benefit Availability Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/benefit-availability']);
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
      const final = [];
      selectedDesignation.forEach(designationId => {
        const obj = {
          'benefitAvailablityId': this.currentId,
          'limit': this.benefitAvailabilityForm.get('limit').value,
          'unit': this.benefitAvailabilityForm.get('unit').value,
          'benefitTypeId': this.benefitAvailabilityForm.get('benefitTypeId').value,
          'designationId': designationId
        }
        final.push(obj);
      });
      const data = final;
      this._benefitAvailS.addBenefitAvailability(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess: true, toastHeading: "Added", toastParagrahp: "Benefit Availability Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
          this._r.navigate(['/connect/console/benefit-availability']);

        }
      }, (error: any) => {
        console.error("Login error:", error);
        //this.toast.error("An error occurred", "Error", { positionClass: 'toast-bottom-left' });
      })
    }
  }
}


