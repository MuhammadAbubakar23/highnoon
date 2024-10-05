import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BulletinService } from '../../services/bulletin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { BankDetails } from '../../models/employee';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-bulletin',
  templateUrl: './create-bulletin.component.html',
  styleUrls: ['./create-bulletin.component.css']
})
export class CreateBulletinComponent implements OnInit {
  selectedFile: File;
  fileObject: any ;
  currentId: any = 0;
  public i: number = 0;
  bulletinForm = new FormGroup({
    title: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    date:new FormControl('', [Validators.required]),
    details:new FormControl('', [Validators.required,Validators.maxLength(100)]),
    //  File: new FormArray([])
    File: new FormControl('')
  });


  constructor(private bulletinn: BulletinService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _hS: HeaderService, private datePipe: DatePipe) {
    this.changeHeader('create');
  }
  ngOnInit(): void {
    this.getBulletinDetails();
  }

  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Bulletins',
        tabs: [{ title: 'Create', url: 'connect/console/create-bulletin', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Bulletin',
        tabs: [{ title: 'Update', url: 'connect/console/update-bulletin', isActive: true }],
        isTab: false,
      })
    }
  }
  getBulletinDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update');
        this.bulletinn.getBulletinById(this.currentId).subscribe((res) => {
          
          // this.bulletinForm.patchValue(res.data)
          // this.patchFileValue(res.data.attachmentName);
          this.fileObject = {
            'attachmentName': res.data.attachmentName,
            'attachmentVirtualName': res.data.attachmentVirtualName,
            'attachmentUrl': res.data.attachmentUrl,
            'lastModified': null,
            'name': res.data.attachmentName,
            'webkitRelativePath':"",
            'size': null,
            'type': null,
            'arrayBuffer':null,
            'slice':null,
            'stream':null,
            'text':null
          };
          const parsedDate = new Date(res.data.date);
          this.bulletinForm.patchValue({
            title: res.data.title,
            details: res.data.details,
            date: this.datePipe.transform(parsedDate, 'yyyy-MM-dd'),
          })
          // console.log('fileArray before patching:', fileArray);
          // // Assuming 'File' is the name of your FormArray control
          // const fileArrayControl = this.bulletinForm.get('File') as FormArray;
          // fileArrayControl.clear(); // Clear existing controls in the FormArray

          // // // Loop through 'fileArray' and add a new control for each file
          // fileArray.forEach(file => {
          //   const fileControl = new FormControl(file);
          //   fileArrayControl.push(fileControl);
          // });

          // this.bulletinForm.get('File').setValue(JSON.stringify(fileObject));
          this.selectedFile = this.fileObject;
          console.log('bulletinForm after patching:', this.bulletinForm.value);
        })
      }
    })
  }
  onFileSelected(event: Event) {
    
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedFile = fileInput.files[0]
      console.log("line by line file pushes", fileInput.files);
    }
  }

  get bF() {
    return this.bulletinForm.controls
  }
  submitForm() {
    
    const formData = new FormData();
    formData.append('title', this.bulletinForm.get('title')?.value);
    formData.append('date', this.bulletinForm.get('date')?.value);
    formData.append('details', this.bulletinForm.get('details')?.value);
    // formData.append('File', this.selectedFile);

    console.log("form data", formData);
    if (this.currentId !== 0 && this.currentId !== undefined) {
      const jsonString = JSON.stringify(this.selectedFile);
      const encoder = new TextEncoder();
      const binaryData = encoder.encode(jsonString);
      const blob = new Blob([binaryData]);
      // blob.name = this.fileObject.attachmentName;
      formData.append('File', blob, this.fileObject.attachmentName);

      console.log(this.bulletinForm)
      formData.append('BulletinBoardId', this.currentId);
      console.log("form data", formData);
      const data = formData;

      this.bulletinn.updateBulletin(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Designation Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/bulletin']);
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
      formData.append('File', this.selectedFile);
      const data = formData;
      this.bulletinn.createBulletin(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Bulletin Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/bulletin']);
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
