import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  pageNumber = 1;
   pageSize = 10;
   totalPages = 0;
   totalRecords=0;
   text = '';
  categoryItems:any=[];
  desColumns=['categoryName'];
  columnNames=['Name'];
  toastData:any={};
  constructor(private _cateS:CategoryService,private _r:Router,private _toastS:ToasterService
    ,private _hS:HeaderService,private spinner: NgxSpinnerService){
    _hS.updateHeaderData({
      title: 'Categories',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

}
  ngOnInit(): void {
  this.getCategories();
  }

  getCategories(){
    this.spinner.show();
    this._cateS.getCategory(this.pageNumber, this.pageSize, this.text).subscribe((res)=>{
      this.categoryItems=res.data;
      this.totalPages=res.totalPages;
      this.totalRecords=res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getCategories();
  }
  generalFilter() {
    this.getCategories();
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getCategories();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getCategories();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getCategories();
    }
  }
  editCategory(id:number){
    this._r.navigateByUrl(`/connect/console/update-category/${id}`);
  }
  deleteCategory(id:any){
    
    this._cateS.deleteCategory(id).subscribe((res)=>{
      if(res.statusCode===200){
        // const categories=this.categoryItems.filter((item:any)=>item.categoryId !== id);
        // this.categoryItems=categories;
        this.getCategories();
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Deleted",toastParagrahp:"Category Deleted Successfully!"}
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
