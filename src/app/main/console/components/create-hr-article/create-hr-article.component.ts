import { Component } from '@angular/core';
import { HRArticleService } from '../../services/hr-article.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-create-hr-article',
  templateUrl: './create-hr-article.component.html',
  styleUrls: ['./create-hr-article.component.css']
})
export class CreateHRArticleComponent {
  currentId: any = 0;
  selectedFiles: File[] = [];
  articleForm = new FormGroup({
    PolicyArticleId: new FormControl(0),
    Date: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    Name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    Description: new FormControl('', [Validators.required]),
    File: new FormControl()
  });
  haveDocument=false;

  constructor(private _HRAS: HRArticleService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  ngOnInit(): void {
    this.getArticleDetails();
  }
  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Articles',
        tabs: [{ title: 'Create', url: 'connect/console/create-policies-articles', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Articles',
        tabs: [{ title: 'Update', url: 'connect/console/update-policies-articles', isActive: true }],
        isTab: false,
      })
    }
  }
  getArticleDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._HRAS.getArticleById(this.currentId).subscribe((res) => {
          this.articleForm.patchValue(res)
        })
      }
    })
  }
  get aF() {
    return this.articleForm.controls
  }
  onFileSelected(event: Event) {
    this.haveDocument=false;
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
      formData.append('PolicyArticleId', this.currentId);
      formData.append('Date', this.articleForm.get('Date')?.value);
      formData.append('Name', this.articleForm.get('Name')?.value);
      formData.append('Description', this.articleForm.get('Description')?.value);

      formData.append('File', this.selectedFiles[0]);
      const data = formData;
      this._HRAS.updateArticle(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Article Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/policies-articles']);
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

      formData.append('PolicyArticleId', '0');
      formData.append('Date', this.articleForm.get('Date')?.value);
      formData.append('Name', this.articleForm.get('Name')?.value);
      formData.append('Description', this.articleForm.get('Description')?.value);

      formData.append('File', this.selectedFiles[0]);
      const data = formData;
      if(this.selectedFiles.length > 0) {
        this._HRAS.createArticle(data).subscribe((res) => {
          console.log(res)
          if (res.statusCode === 200) {
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Article Added Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this._r.navigate(['/connect/console/policies-articles']);
            this._toastS.hide();
          }
        }, (error: any) => {
          console.error("Internal Server Error", error);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
      else{
        this.haveDocument=true;
      }
    }
  }
}
