import { Component } from '@angular/core';
import { DesignationSubsidyService } from '../../services/designation-subsidy.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-create-designation-subsidy',
  templateUrl: './create-designation-subsidy.component.html',
  styleUrls: ['./create-designation-subsidy.component.css']
})
export class CreateDesignationSubsidyComponent {
  currentId: any = 0;
  designations: any = [];
  availableMedicine: any = [];
  isMultiple: boolean = true;
  selectedDesignation: any = [];
  designationSubsidyForm = new FormGroup({
    subsidizedPrice: new FormControl(0, [Validators.required]),
    availableMedicineId: new FormControl(0, [Validators.required]),
    designationId: new FormControl([], [Validators.required])
  });
  constructor(private _desSubS: DesignationSubsidyService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  changeHeader(title: string) {
    
    if (title === 'create') {
      this.isMultiple = true;
      this._hS.updateHeaderData({
        title: 'Designation Subsidiary',
        tabs: [{ title: 'Create', url: 'connect/console/create-designation-subsidy', isActive: true }],
        isTab: false,
      })
    }
    else {

      this._hS.updateHeaderData({
        title: 'Designation Subsidiary',
        tabs: [{ title: 'Update', url: 'connect/console/update-designation-subsidy', isActive: true }],
        isTab: false,
      })
    }
  }
  ngOnInit(): void {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this.isMultiple = false;
        this._desSubS.getDesignationSubsidyById(this.currentId).subscribe((res) => {
          this.designationSubsidyForm.patchValue(res.data);
          this.designationSubsidyForm.get('designationId').setValue(res.data.designationId)

        })

      }
    })
    this._DDS.getDesignationForDD().subscribe((res) => {
      this.designations = res.data;
    })
    this._DDS.getAvailableMedicineForDD().subscribe((res) => {
      this.availableMedicine = res.data;
    })
  }

  get dSF() {
    return this.designationSubsidyForm.controls
  }
  submitForm() {
    
    let selectedDesignation = this.designationSubsidyForm.get('designationId').value;
    if (this.currentId === undefined) {
      this.currentId = 0;
    }

    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = {
        'designationSubsidizedMedicineId': this.currentId,
        'subsidizedPrice': this.designationSubsidyForm.get('subsidizedPrice').value,
        'availableMedicineId': this.designationSubsidyForm.get('availableMedicineId').value,
        'designationId': selectedDesignation
      };
      this._desSubS.updateDesignationSubsidy(data).subscribe((res) => {
        
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Designation Subsidy Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/designation-subsidy']);
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
          'designationSubsidizedMedicineId': this.currentId,
          'subsidizedPrice': this.designationSubsidyForm.get('subsidizedPrice').value,
          'availableMedicineId': this.designationSubsidyForm.get('availableMedicineId').value,
          'designationId': designationId
        }
        final.push(obj);
      });
      const data = final;
      this._desSubS.addDesignationSubsidy(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Designation Subsidy Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
          this._r.navigate(['/connect/console/designation-subsidy']);

        }
      }, (error: any) => {
        console.error("Login error:", error);
        //this.toast.error("An error occurred", "Error", { positionClass: 'toast-bottom-left' });
      })
    }
  }
}


