import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { TravelTypesService } from '../../services/travel-types.service';

@Component({
  selector: 'app-create-travel-types',
  templateUrl: './create-travel-types.component.html',
  styleUrls: ['./create-travel-types.component.css']
})
export class CreateTravelTypesComponent {
  travelTypeId:any=0;
  travelById: any=0;
  TravelForm = new FormGroup({
    travelTypeName:new FormControl('',[Validators.required,Validators.maxLength(100)]),
  });


constructor(private _travelS: TravelTypesService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _hS:HeaderService){
  this.changeHeader('create');
}
ngOnInit(): void {
  this.getTravelDetails();
}
changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'Travel Type',
      tabs: [{ title: 'Create', url: 'connect/console/create-travel-type', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'Travel Type',
      tabs: [{ title: 'Update', url: 'connect/console/update-travel-type', isActive: true }],
      isTab: false,
    })
  }
}

getTravelDetails(){

  this._aR.params.subscribe((params)=>{
    console.log(params);
    // this.travelTypeId = params['id'];
    const idParam = params['id'];
    this.travelById = idParam !== undefined ? +idParam : 0;
    if(this.travelById !==0 && this.travelById !== undefined){
      this.changeHeader('update')
      this._travelS.getTravelTypeById(this.travelById).subscribe((res)=>{
        this.TravelForm.patchValue({
          travelTypeName: res.data.travelByName,
        })
      })
    }
  })
}
get cF(){
  return this.TravelForm.controls
}
  submitForm(){


    if(this.travelById !== 0 && this.travelById !== undefined){
      console.log(this.TravelForm)
     const data={
      travelTypeId: this.travelById,
      travelTypeName: this.TravelForm.get('travelTypeName').value,
    }
     this._travelS.updateTravelType(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"Travel Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/travel-types']);
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
      travelTypeId: 0,
      travelTypeName: this.TravelForm.get('travelTypeName').value,
    }
     this._travelS.createTravelType(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"Travel Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/travel-types']);
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
