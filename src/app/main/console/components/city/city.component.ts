import { Component } from '@angular/core';
import { CityService } from '../../services/city.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords=0;
  // text = '';
  cityItems:any=[];
  desColumns=['name'];
  columnNames=['Name'];
  toastData:any={};
  constructor(private _cityS:CityService,private _r:Router,private _toastS:ToasterService,
    private _hS:HeaderService,private spinner: NgxSpinnerService){
    _hS.updateHeaderData({
      title: 'Cities',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

}
  ngOnInit(): void {
  this.getCities();
  }

  getCities(){
    this.spinner.show();
    this._cityS.getCity(this.pageNumber, this.pageSize, ).subscribe((res)=>{
      this.cityItems=res.data;
      this.totalPages=res.totalPages;
      this.totalRecords=res.totalRecords;
      this.spinner.hide();
    })
  }
  // resetinput(){
  //   this.text='';
  //   this.getCities();
  // }
  // generalFilter() {
  //   this.getCities();
  // }
  visiblePages(): number[] {
    const currentPage = this.pageNumber;
    const totalPages = this.totalPages;
    let visiblePageNumbers: number[] = [];
    visiblePageNumbers.push(1);
    if (currentPage - 2 > 2) {
      visiblePageNumbers.push(-1);
    }

    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      visiblePageNumbers.push(i);
    }
    if (currentPage + 2 < totalPages - 1) {
      visiblePageNumbers.push(-1);
    }
    if (totalPages > 1) {
      visiblePageNumbers.push(totalPages);
    }

    return visiblePageNumbers;
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getCities();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getCities();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getCities();
    }
  }

  editCity(id:number){
    this._r.navigateByUrl(`/connect/console/update-city/${id}`);
  }
  deleteCity(id:any){

    this._cityS.deleteCity(id).subscribe((res)=>{
      if(res.statusCode===200){
        // const cities=this.cityItems.filter((item:any)=>item.cityId !== id);
        // this.cityItems=cities;
        this.getCities();
        const toasterObject={isShown:true,isSuccess:true,toastHeading:"Deleted",toastParagrahp:"City Deleted Successfully!"}
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
