import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { StateService } from '../../services/state.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { HeaderService } from 'src/app/services/header.service';


@Component({
  selector: 'app-create-state',
  templateUrl: './create-state.component.html',
  styleUrls: ['./create-state.component.css']
})
export class CreateStateComponent {
  currentId:any=0;
  countries=[]
  stateForm = new FormGroup({
    name:new FormControl('',[Validators.required,Validators.maxLength(100)]),
    countryId:new FormControl(0)
  });


constructor(private _stateS:StateService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _DDS:DropDownApiService,private _hS:HeaderService){
this.changeHeader('create')
}
ngOnInit(): void {
  this.getStateDetails();

}
changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'States',
      tabs: [{ title: 'Create', url: 'connect/console/create-state', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'States',
      tabs: [{ title: 'Update', url: 'connect/console/update-state', isActive: true }],
      isTab: false,
    })
  }
}
getStateDetails(){
  this._aR.params.subscribe((params)=>{
    console.log(params);
    this.currentId = params['id'];
    if(this.currentId !==0 && this.currentId !== undefined){
      this.changeHeader('update')
      this._stateS.getStateById(this.currentId).subscribe((res)=>{

        this.stateForm.patchValue({
          name: res.data.name,
          countryId:res.data.countryId
        })
      })
    }
      this._DDS.getCountriesForDD().subscribe((res)=>{
        this.countries = res.data;
      })
  })
}
get sF(){
  return this.stateForm.controls
}
  submitForm(){
    

    if(this.currentId !== 0 && this.currentId !== undefined){
      console.log(this.stateForm)
     const data={
      id: this.currentId,
      name: this.stateForm.get('name').value,
      countryId:this.stateForm.get('countryId').value
      // isActive: this.stateForm.get('isActive').value
    }
     this._stateS.updateState(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"State Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/states']);
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
      name: this.stateForm.get('name').value,
      countryId:this.stateForm.get('countryId').value
    }
     this._stateS.createState(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"State Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/states']);
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

