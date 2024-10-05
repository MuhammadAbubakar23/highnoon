import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.css']
})
export class CreateDepartmentComponent {
  currentId:any=0;
  categories=[]
  departmentForm = new FormGroup({
    departmentName:new FormControl('',[Validators.required, Validators.maxLength(100)]),
    categoryId:new FormControl(0,[Validators.required]),
  });


constructor(private _depS:DepartmentService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _DDS:DropDownApiService,private _hS:HeaderService){
  this.changeHeader('create');


}
ngOnInit(): void {
  this.getDepartmentDetails();
}

changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'Departments',
      tabs: [{ title: 'Create', url: 'connect/console/create-department', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'Departments',
      tabs: [{ title: 'Update', url: 'connect/console/update-department', isActive: true }],
      isTab: false,
    })
  }
}
getDepartmentDetails(){
  this._aR.params.subscribe((params)=>{
    console.log(params);
    this.currentId = params['id'];
    if(this.currentId !==0 && this.currentId !== undefined){
      this.changeHeader('update');
      this._depS.getDepartmentById(this.currentId).subscribe((res)=>{
        this.departmentForm.patchValue({
          departmentName: res.data.departmentName,
          categoryId: res.data.categoryId
        })
      })
    }

      this._DDS.getCategoriesForDD().subscribe((res)=>{
        this.categories = res.data;
      })

  })
}
get dF(){
  return this.departmentForm.controls
}
  submitForm(){
    

    if(this.currentId !== 0 && this.currentId !== undefined){
      console.log(this.departmentForm)
     const data={
      id: this.currentId,
      departmentName: this.departmentForm.get('departmentName').value,
      categoryId:this.departmentForm.get('categoryId').value,
    }
     this._depS.updateDepartment(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"Department Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/departments']);
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
      departmentName: this.departmentForm.get('departmentName').value,
      categoryId:this.departmentForm.get('categoryId').value,
      // isActive: this.departmentForm.get('isActive').value
    }
     this._depS.createDepartment(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"Department Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/departments']);
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
