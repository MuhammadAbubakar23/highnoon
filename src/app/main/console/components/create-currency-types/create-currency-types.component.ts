import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { CurrencyTypesService } from '../../services/currency-types.service';


@Component({
  selector: 'app-create-currency-types',
  templateUrl: './create-currency-types.component.html',
  styleUrls: ['./create-currency-types.component.css']
})
export class CreateCurrencyTypesComponent {
  currencyTypeId:number=0;
  CurrencyForm = new FormGroup({
    currencyName:new FormControl('',[Validators.required,Validators.maxLength(100)]),
    currencyCode:new FormControl('',[Validators.required,Validators.maxLength(100)]),
  });


constructor(private _currencyS: CurrencyTypesService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _hS:HeaderService){
  this.changeHeader('create');
}
ngOnInit(): void {
  this.getCurrencyDetails();
}
changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'Currencies',
      tabs: [{ title: 'Create', url: 'connect/console/create-currency-type', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'Countries',
      tabs: [{ title: 'Update', url: 'connect/console/update-currency-type', isActive: true }],
      isTab: false,
    })
  }
}

getCurrencyDetails(){
  
  this._aR.params.subscribe((params)=>{
    console.log(params);
    // this.currencyTypeId = params['id'];
    const idParam = params['id'];
    this.currencyTypeId = idParam !== undefined ? +idParam : 0;
    if(this.currencyTypeId !==0 && this.currencyTypeId !== undefined){
      this.changeHeader('update')
      this._currencyS.getCurrencyTypeById(this.currencyTypeId).subscribe((res)=>{
        this.CurrencyForm.patchValue({
          currencyName: res.data.currencyName,
          currencyCode: res.data.currencyCode
        })
      })
    }
  })
}
get cF(){
  return this.CurrencyForm.controls
}
  submitForm(){
    

    if(this.currencyTypeId !== 0 && this.currencyTypeId !== undefined){
      console.log(this.CurrencyForm)
     const data={
      currencyTypeId: this.currencyTypeId,
      currencyName: this.CurrencyForm.get('currencyName').value,
      currencyCode: this.CurrencyForm.get('currencyCode').value,
    }
     this._currencyS.updateCurrencyType(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"Currency Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/currency-types']);
        this._toastS.hide();
      }

    }, (error: any) => {
      console.error("Internal Server Error", error);
      const toasterObject = { isShown: true,isSuccess:false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })

    }
    else{
     const data={
      currencyTypeId: 0,
      currencyName: this.CurrencyForm.get('currencyName').value,
      currencyCode: this.CurrencyForm.get('currencyCode').value
    }
     this._currencyS.createCurrencyType(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"Currency Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/currency-types']);
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
