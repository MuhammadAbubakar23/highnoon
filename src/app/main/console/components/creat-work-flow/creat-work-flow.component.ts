import { Component } from '@angular/core';
import { WorkFlowService } from '../../services/work-flow.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-creat-work-flow',
  templateUrl: './creat-work-flow.component.html',
  styleUrls: ['./creat-work-flow.component.css']
})
export class CreatWorkFlowComponent {
  currentId:any=0;
  workFlowForm = new FormGroup({
    name:new FormControl('',[Validators.required, Validators.maxLength(100)]),
    description:new FormControl('',[Validators.required, Validators.maxLength(200)]),
  });


constructor(private _wFS:WorkFlowService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _DDS:DropDownApiService,private _hS:HeaderService){
  this.changeHeader('create');


}
ngOnInit(): void {
  this.getStageDetails();
}

changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'workflows',
      tabs: [{ title: 'Create', url: 'connect/console/create-workflow', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'workflows',
      tabs: [{ title: 'Update', url: 'connect/console/update-workflow', isActive: true }],
      isTab: false,
    })
  }
}
getStageDetails(){
  this._aR.params.subscribe((params)=>{
    console.log(params);
    this.currentId = params['id'];
    if(this.currentId !==0 && this.currentId !== undefined){
      this.changeHeader('update');
      this._wFS.getWorkFlowById(this.currentId).subscribe((res)=>{
        this.workFlowForm.patchValue({
          name: res.data.name,
          description: res.data.description,
        })
      })
    }

      // this._DDS.getWorkFlowsForDD().subscribe((res)=>{
      //   this.workflows = res;
      //   console.log(this.workflows)
      // })

  })
}
get wF(){
  return this.workFlowForm.controls
}
  submitForm(){
    

    if(this.currentId !== 0 && this.currentId !== undefined){
      console.log(this.workFlowForm)
     const data={
      workFlowId: this.currentId,
      name: this.workFlowForm.get('name').value,
      description: this.workFlowForm.get('description').value,
    }
     this._wFS.updateWorkFlow(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"Workflow Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/workflows']);
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
      workFlowId: 0,
      name: this.workFlowForm.get('name').value,
      description: this.workFlowForm.get('description').value,
    }
     this._wFS.createWorkFlow(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"Workflow Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/workflows']);
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

