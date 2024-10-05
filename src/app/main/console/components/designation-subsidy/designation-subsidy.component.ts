import { Component } from '@angular/core';
import { DesignationSubsidyService } from '../../services/designation-subsidy.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-designation-subsidy',
  templateUrl: './designation-subsidy.component.html',
  styleUrls: ['./designation-subsidy.component.css']
})
export class DesignationSubsidyComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = '';
  subsidyItems: any = [];
  desColumns = ["subsidizedPrice", "availableMedicine",  "designation"];
  columnNames = ['Subsidized Price', 'Available Medicine', 'Designation'];
  toastData: any = {};
  constructor(private _dSS:DesignationSubsidyService , private _r: Router, private _toastS: ToasterService
    , private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Designation Subsidiary',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

  }
  ngOnInit(): void {
    this.getDesignationSubsidy();
  }

  getDesignationSubsidy() {
    this.spinner.show();
    this._dSS.getDesignationSubsidy(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.subsidyItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getDesignationSubsidy();
  }
  generalFilter() {
    this.getDesignationSubsidy();
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
       this.getDesignationSubsidy();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
       this.getDesignationSubsidy();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
       this.getDesignationSubsidy();
    }
  }

  editDesignationSubsidy(id: number) {
    this._r.navigateByUrl(`/connect/console/update-designation-subsidy/${id}`);
  }
  deleteDesignationSubsidy(id: any) {
    
    this._dSS.deleteDesignationSubsidy(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const categories=this.benefitTypeItems.filter((item:any)=>item.categoryId !== id);
        // this.benefitTypeItems=categories;
        this.getDesignationSubsidy();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Designation Subsidy Deleted Successfully!" }
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
