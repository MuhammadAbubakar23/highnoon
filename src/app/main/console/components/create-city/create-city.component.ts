import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { CityService } from '../../services/city.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { HeaderService } from 'src/app/services/header.service';


@Component({
  selector: 'app-create-city',
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.css']
})
export class CreateCityComponent {
  currentId:any=0;
  states=[];
  cityForm = new FormGroup({
    name:new FormControl('',[Validators.required,Validators.maxLength(100)]),
    stateId:new FormControl(0,[Validators.required])
  });


constructor(private _cityS:CityService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _DDS:DropDownApiService,private _hS:HeaderService){
  this.changeHeader('create');
}
ngOnInit(): void {
  this.getCityDetails();

}
getCityDetails(){
  this._aR.params.subscribe((params)=>{
    console.log(params);
    this.currentId = params['id'];
    if(this.currentId !==0 && this.currentId !== undefined){
      this.changeHeader('update')
      this._cityS.getCityById(this.currentId).subscribe((res)=>{
        console.log(res.data);
        this.cityForm.patchValue({
          name: res.data.name,
          stateId:res.data.stateId
        })
      })
    }

      this._DDS.getStatesForDD().subscribe((res)=>{
        
        this.states = res.data;
      })

  })
}
changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'Cities',
      tabs: [{ title: 'Create', url: 'connect/console/create-city', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'Cities',
      tabs: [{ title: 'Update', url: 'connect/console/update-city', isActive: true }],
      isTab: false,
    })
  }
}
get cF(){
  return this.cityForm.controls
}
  submitForm(){
    

    if(this.currentId !== 0 && this.currentId !== undefined){
      console.log(this.cityForm)
     const data={
      id: this.currentId,
      name: this.cityForm.get('name').value,
      stateId: this.cityForm.get('stateId').value,
    }
     this._cityS.updateCity(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"City Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/cities']);
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
      name: this.cityForm.get('name').value,
      stateId: this.cityForm.get('stateId').value,
    }
     this._cityS.createCity(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"City Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/cities']);
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
