import { Component } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import {  Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords=0;
  departmentItems:any=[];
  desColumns=['departmentName'];
  columnNames=['Name'];
  toastData:any={};
  constructor(private _depS:DepartmentService,private _r:Router,private _toastS:ToasterService,
    private _hS:HeaderService,private spinner: NgxSpinnerService){
    _hS.updateHeaderData({
      title: 'Departments',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
}
  ngOnInit(): void {
  this.getDepartments();
  }

  getDepartments(){
    this.spinner.show();
    this._depS.getDepartments(this.pageNumber, this.pageSize).subscribe((res)=>{
      this.departmentItems=res.data
      this.totalPages=res.totalPages;
      this.totalRecords=res.totalRecords;
      this.spinner.hide();
    })
  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getDepartments();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getDepartments();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getDepartments();
    }
  }
  editDepartment(id:number){
    this._r.navigateByUrl(`/connect/console/update-department/${id}`);
  }
  deleteDepartment(id:any){
    
    this._depS.deleteDepartment(id).subscribe((res)=>{
      if(res.statusCode===200){
        // const departments=this.departmentItems.filter((item:any)=>item.departmentId !== id);
        // this.departmentItems=departments;
        this.getDepartments();
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Deleted",toastParagrahp:"Department Deleted Successfully!"}
        this._toastS.updateToastData(toasterObject)
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
