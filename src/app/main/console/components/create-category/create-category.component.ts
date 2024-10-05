import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent {
  currentId=0;
  employers=[];
  categoryForm = new FormGroup({
    id:new FormControl(0),
    categoryName:new FormControl('',[Validators.required,Validators.maxLength(100)]),
    employerId:new FormControl(0,[Validators.required])
  });


constructor(private _cateS:CategoryService,private _aR:ActivatedRoute,private _r:Router,private _toastS:ToasterService,private _DDS:DropDownApiService,private _hS:HeaderService){
  this.changeHeader('create');
}
ngOnInit(): void {
  this.getCategoryDetails();

}
getCategoryDetails(){
  this._aR.params.subscribe((params)=>{
    this.currentId = params['id'];
    if(this.currentId !==0 && this.currentId !== undefined){
      this.changeHeader('update')
      this._cateS.getCategoryById(this.currentId).subscribe((res)=>{

        this.categoryForm.patchValue(res.data)
      })
    }

      this._DDS.getEmployersForDD().subscribe((res)=>{
        
        this.employers = res.data;
      })

  })
}
changeHeader(title:string){
  if(title ==='create'){
    this._hS.updateHeaderData({
      title: 'Categories',
      tabs: [{ title: 'Create', url: 'connect/console/create-category', isActive: true }],
      isTab: false,
    })
  }
  else{
    this._hS.updateHeaderData({
      title: 'Categories',
      tabs: [{ title: 'Update', url: 'connect/console/update-category', isActive: true }],
      isTab: false,
    })
  }
}
get cF(){
  return this.categoryForm.controls
}
  submitForm(){
    

    if(this.currentId !== 0 && this.currentId !== undefined){
      console.log(this.categoryForm)
     const data={
      id: this.currentId,
      categoryName:this.categoryForm.get('categoryName').value,
      employerId:this.categoryForm.get('employerId').value
    }
     this._cateS.updateCategory(data).subscribe((res)=>{

      if(res.statusCode===200){

        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Updated",toastParagrahp:"Category Updated Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/categories']);
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
        id:0,
        categoryName:this.categoryForm.get('categoryName').value,
        employerId:this.categoryForm.get('employerId').value
      }
     this._cateS.createCategory(data).subscribe((res)=>{
      console.log(res)
      if(res.statusCode===200){
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Added",toastParagrahp:"Category Added Successfully!"}
        this._toastS.updateToastData(toasterObject)
        this._r.navigate(['/connect/console/categories']);
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
