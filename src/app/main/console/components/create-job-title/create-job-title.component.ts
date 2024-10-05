import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';

import { JobTitleService } from '../../services/job-title.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-create-job-title',
  templateUrl: './create-job-title.component.html',
  styleUrls: ['./create-job-title.component.css']
})
export class CreateJobTitleComponent {
  currentId: any = 0;
  jobTitleForm = new FormGroup({
    title: new FormControl('', [Validators.required,Validators.maxLength(100)]),
  });


  constructor(private _jTS: JobTitleService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _hS: HeaderService) {

    this.changeHeader('create')


  }
  ngOnInit(): void {
    this.getJobTitleDetails();
  }
  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Job Title',
        tabs: [{ title: 'Create', url: 'connect/console/create-job-title', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Job Title',
        tabs: [{ title: 'Update', url: 'connect/console/update-job-title', isActive: true }],
        isTab: false,
      })
    }
  }
  getJobTitleDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._jTS.getJobTitleById(this.currentId).subscribe((res) => {
          console.log(res.data);
          this.jobTitleForm.patchValue({
            title: res.data.title,
          })
        })
      }
    })
  }
  get jTF() {
    return this.jobTitleForm.controls
  }
  submitForm() {
    

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.jobTitleForm)
      const data = {
        id: this.currentId,
        title: this.jobTitleForm.get('title').value,
      }
      this._jTS.updateJobTitle(data).subscribe((res) => {

        if (res.statusCode === 200) {

          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Job Title Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/job-title']);
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
        title: this.jobTitleForm.get('title').value,
      }
      this._jTS.createJobTitle(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Job Title Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/job-title']);
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

