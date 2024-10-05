import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { TravelPreferenceTimeService } from '../../services/travel-preference-time.service';
import { Time } from '@angular/common';

@Component({
  selector: 'app-create-travel-preference-time',
  templateUrl: './create-travel-preference-time.component.html',
  styleUrls: ['./create-travel-preference-time.component.css']
})
export class CreateTravelPreferenceTimeComponent {
  preferenceTimeId:any=0;
  preferenceTimeForm = new FormGroup({
    preferneceTimeSpan:new FormControl('',[Validators.required,Validators.maxLength(100)]),
    fromTime:new FormControl(null),
    toTime:new FormControl(null)
  });


constructor(private _travelS: TravelPreferenceTimeService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _hS:HeaderService){
  this.changeHeader('create');
}
ngOnInit(): void {
  this.getTravelPreferenceTimeDetails();
}
changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'Travel Preference Time',
      tabs: [{ title: 'Create', url: 'connect/console/create-travel-preference-time', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'Countries',
      tabs: [{ title: 'Update', url: 'connect/console/update-travel-preference-time', isActive: true }],
      isTab: false,
    })
  }
}

getTravelPreferenceTimeDetails(){
  
  this._aR.params.subscribe((params)=>{
    console.log(params);
    const idParam = params['id'];
    this.preferenceTimeId = idParam !== undefined ? +idParam : 0;
    // this.preferenceTimeId = params['id'];
    if(this.preferenceTimeId !==0 && this.preferenceTimeId !== undefined){
      this.changeHeader('update')
      this._travelS.getTravelPreferenceTimeById(this.preferenceTimeId).subscribe((res)=>{
        this.preferenceTimeForm.patchValue({
          preferneceTimeSpan: res.data.preferneceTimeSpan,
          fromTime: this.convertApiFormatToTime(res.data.fromTime),
          toTime: this.convertApiFormatToTime(res.data.fromTime)
        })
      })
    }
  })
}
get cF(){
  return this.preferenceTimeForm.controls
}
  submitForm(){
    

    if(this.preferenceTimeId !== 0 && this.preferenceTimeId !== undefined){
      console.log(this.preferenceTimeForm)
     const data={
      preferenceTimeId: this.preferenceTimeId,
      preferneceTimeSpan: this.preferenceTimeForm.get('preferneceTimeSpan').value,
      fromTime: this.convertDateToApiFormat(this.preferenceTimeForm.get('fromTime').value),
      toTime: this.convertDateToApiFormat(this.preferenceTimeForm.get('toTime').value),
    }
     this._travelS.updateTravelPreferenceTime(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"Travel Preference Time Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/travel-preference-time']);
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
      preferenceTimeId: 0,
      fromTime: this.convertDateToApiFormat(this.preferenceTimeForm.get('fromTime').value),
      toTime: this.convertDateToApiFormat(this.preferenceTimeForm.get('toTime').value),
      preferneceTimeSpan: this.preferenceTimeForm.get('preferneceTimeSpan').value
    }
     this._travelS.createTravelPreferenceTime(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"Travel Preference Time Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/travel-preference-time']);
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
  convertDateToApiFormat(inputTimeString: string)  {
    
    const timeArray = inputTimeString.split(':');
    const hours = timeArray[0];
    const minutes = timeArray[1];

    return `${hours}:${minutes}:00`;
  }

  convertApiFormatToTime(apiTimeString: string): string {
    const timeArray = apiTimeString.split(':');
    const hours = parseInt(timeArray[0], 10);
    const minutes = parseInt(timeArray[1], 10);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }
}
