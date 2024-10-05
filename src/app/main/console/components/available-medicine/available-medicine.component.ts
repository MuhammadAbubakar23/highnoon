import { Component } from '@angular/core';
import { AvailableMedicineService } from '../../services/available-medicine.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-available-medicine',
  templateUrl: './available-medicine.component.html',
  styleUrls: ['./available-medicine.component.css']
})
export class AvailableMedicineComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  medicineItems: any = [];
  desColumns = [ "name","marketPrice"];
  columnNames = ['Name','Market Price'];
  text = '';

  constructor(private _aMS:AvailableMedicineService, private _r: Router, private _toastS: ToasterService
    , private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Available Medicine',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

  }
  ngOnInit(): void {
    this.getAvailableMedicine();
  }

  getAvailableMedicine() {
    this.spinner.show();
    this._aMS.getAvailableMedicine(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.medicineItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getAvailableMedicine();
  }
  generalFilter() {
    this.getAvailableMedicine();
  }
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
      this.getAvailableMedicine();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getAvailableMedicine();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getAvailableMedicine();
    }
  }
 
  editAvailableMedicine(id: number) {
    this._r.navigateByUrl(`/connect/console/update-available-medicine/${id}`);
  }
  deletegetAvailableMedicine(id: any) {
    
    this._aMS.deleteAvailableMedicine(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const categories=this.benefitTypeItems.filter((item:any)=>item.categoryId !== id);
        // this.benefitTypeItems=categories;
        this.getAvailableMedicine();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Medicine Deleted Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();

      }
    }, (error: any) => {
      console.error("Internal Server Error", error);
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }
}
