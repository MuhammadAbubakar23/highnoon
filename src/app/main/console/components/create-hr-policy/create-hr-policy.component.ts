import { Component } from '@angular/core';
import { HRPolicyService } from '../../services/hr-policy.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-create-hr-policy',
  templateUrl: './create-hr-policy.component.html',
  styleUrls: ['./create-hr-policy.component.css']
})
export class CreateHRPolicyComponent {
  currentId: any = 0;
  selectedFiles: File[] = [];
  policyForm = new FormGroup({
    Files: new FormArray([])
  });


  constructor(private _HRPDS: HRPolicyService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _hS: HeaderService) {
    this.changeHeader('create');


  }
  ngOnInit(): void {
    this.getPolicyDetails();

  }
  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'HR Policies',
        tabs: [{ title: 'Create', url: 'connect/console/create-policies-documents', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'HR Policies',
        tabs: [{ title: 'Update', url: 'connect/console/update-policies-documents', isActive: true }],
        isTab: false,
      })
    }
  }
  getPolicyDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._HRPDS.getPolicyDocumentsById(this.currentId).subscribe((res) => {
          this.policyForm.patchValue(res)
        })
      }
    })
  }

  get pF() {
    return this.policyForm.controls
  }

  onFileSelected(event: Event) {
    
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedFiles = [];
      for (let i = 0; i < fileInput.files.length; i++) {
        this.selectedFiles.push(fileInput.files[i]);
      }
    }
  }
  removeFile(index) {
    this.selectedFiles.splice(index, 1);
    // if (this.formFileInput) {
    //   console.log("Removed file",this.selectedFiles.length)
    //   
    //   this.formFileInput.nativeElement.value = `${this.selectedFiles.length} files}`;
    // }
  }
  submitForm() {
    
    const formData = new FormData();
    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.policyForm)
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('Files', this.selectedFiles[i]);
      }
      this._HRPDS.updatePolicyDocuments(formData).subscribe((res) => {

        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Policy  Document Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/policies-documents']);
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

      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('Files', this.selectedFiles[i]);
      }
      console.log("formData.getAll",formData['Files']);
      this._HRPDS.createPolicyDocuments(formData).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Policy  Document Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/policies-documents']);
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
