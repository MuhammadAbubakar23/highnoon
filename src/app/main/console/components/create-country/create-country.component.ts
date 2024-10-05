import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { CountryService } from '../../services/country.service';
import { HeaderService } from 'src/app/services/header.service';


@Component({
  selector: 'app-create-country',
  templateUrl: './create-country.component.html',
  styleUrls: ['./create-country.component.css']
})
export class CreateCountryComponent {
  currentId:any=0;
  CountryForm = new FormGroup({
    name:new FormControl('',[Validators.required,Validators.maxLength(100)]),
  });


constructor(private _countryS:CountryService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _hS:HeaderService){
  this.changeHeader('create');


}
ngOnInit(): void {
  this.geCountryDetails();
}
changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'Countries',
      tabs: [{ title: 'Create', url: 'connect/console/create-country', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'Countries',
      tabs: [{ title: 'Update', url: 'connect/console/update-country', isActive: true }],
      isTab: false,
    })
  }
}

geCountryDetails(){
  this._aR.params.subscribe((params)=>{
    console.log(params);
    this.currentId = params['id'];
    if(this.currentId !==0 && this.currentId !== undefined){
      this.changeHeader('update')
      this._countryS.getCountryById(this.currentId).subscribe((res)=>{
        this.CountryForm.patchValue({
          name: res.data.name,
        })
      })
    }
  })
}
get cF(){
  return this.CountryForm.controls
}
  submitForm(){
    

    if(this.currentId !== 0 && this.currentId !== undefined){
      console.log(this.CountryForm)
     const data={
      id: this.currentId,
      name: this.CountryForm.get('name').value,
    }
     this._countryS.updateCountry(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"Country Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/countries']);
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
      id: 0,
      name: this.CountryForm.get('name').value,
    }
     this._countryS.createCountry(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"Country Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/countries']);
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
