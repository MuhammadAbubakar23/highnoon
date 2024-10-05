import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { TravelClassService } from '../../services/travel-class.service';

@Component({
  selector: 'app-create-travel-classes',
  templateUrl: './create-travel-classes.component.html',
  styleUrls: ['./create-travel-classes.component.css']
})
export class CreateTravelClassesComponent {
  travelClassId:any=0;
  TravelForm = new FormGroup({
    travelClassName:new FormControl('',[Validators.required,Validators.maxLength(100)]),
  });


constructor(private _travelS: TravelClassService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _hS:HeaderService){
  this.changeHeader('create');
}
ngOnInit(): void {
  this.getTravelDetails();
}
changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'Travel Class',
      tabs: [{ title: 'Create', url: 'connect/console/create-travel-class', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'Travel Class',
      tabs: [{ title: 'Update', url: 'connect/console/update-travel-class', isActive: true }],
      isTab: false,
    })
  }
}

getTravelDetails(){
  this._aR.params.subscribe((params)=>{
    console.log(params);
    // this.travelTypeId = params['id'];
    const idParam = params['id'];
    this.travelClassId = idParam !== undefined ? +idParam : 0;
    if(this.travelClassId !==0 && this.travelClassId !== undefined){
      this.changeHeader('update')
      this._travelS.getTravelClassById(this.travelClassId).subscribe((res)=>{
        this.TravelForm.patchValue({
          travelClassName: res.data.travelClassName,
        })
      })
    }
  })
}
get cF(){
  return this.TravelForm.controls
}
  submitForm(){    

    if(this.travelClassId !== 0 && this.travelClassId !== undefined){
      console.log(this.TravelForm)
     const data={
      travelClassId: this.travelClassId,
      travelClassName: this.TravelForm.get('travelClassName').value,
    }
     this._travelS.updateTravelClass(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"Travel Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/travel-classes']);
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
      travelClassId: 0,
      travelClassName: this.TravelForm.get('travelClassName').value,
    }
     this._travelS.createTravelClass(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"Travel Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/travel-classes']);
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
