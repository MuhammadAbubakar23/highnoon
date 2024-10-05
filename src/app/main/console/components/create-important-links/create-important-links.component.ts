import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { ImportantLinksService } from '../../services/important-links.service';

@Component({
  selector: 'app-create-important-links',
  templateUrl: './create-important-links.component.html',
  styleUrls: ['./create-important-links.component.css']
})
export class CreateImportantLinksComponent {
  currentId: any = 0;
  ImportantLinksForm = new FormGroup({
    linkURL: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    importantLinkId: new FormControl(null),
  });


  constructor(private _iLS: ImportantLinksService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService,private _hS:HeaderService) {
    this.changeHeader('create');


  }
  ngOnInit(): void {
    this.getImportantLinkDetails();

  }
  changeHeader(title:string){
    if(title ==='create'){
      this._hS.updateHeaderData({
        title: 'Create Important Links',
        tabs: [{ title: 'Create', url: 'connect/console/create-important-link', isActive: true }],
        isTab: false,
      })
    }
    else{
      this._hS.updateHeaderData({
        title: 'Update Important Links',
        tabs: [{ title: 'Update', url: 'connect/console/update-important-link', isActive: true }],
        isTab: false,
      })
    }
  }
  getImportantLinkDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._iLS.getImportantLinkById(this.currentId).subscribe((res) => {
          this.ImportantLinksForm.patchValue({
            linkURL: res.data.linkURL,
            // isActive:res.data.isActive
          })
        })
      }
    })
  }
  get lF() {
    return this.ImportantLinksForm.controls
  }
  submitForm() {
    

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.ImportantLinksForm)
      const data = {
        importantLinkId: this.currentId,
        linkURL: this.ImportantLinksForm.get('linkURL').value,
        isActive: true
      }
      this._iLS.updateImportantLink(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Important Link Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/important-links']);
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
        importantLinkId: 0,
        linkURL: this.ImportantLinksForm.get('linkURL').value,
        isActive: true
      }
      this._iLS.createImportantLink(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Added", toastParagrahp: "Important Link Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/important-links']);
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
