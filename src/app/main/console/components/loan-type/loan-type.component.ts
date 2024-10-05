import { Component } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoanTypeService } from '../../services/loan-type.service';

@Component({
  selector: 'app-loan-type',
  templateUrl: './loan-type.component.html',
  styleUrls: ['./loan-type.component.css']
})
export class LoanTypeComponent {

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = '';
  loanTypeItems: any = [];
  desColumns = ['name'];
  columnNames = ['Name'];

  constructor(private _loanTS: LoanTypeService, private _route: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Loan Type',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getLoanType();
  }

  getLoanType() {
    this.spinner.show();
    this._loanTS.getLoanType(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.loanTypeItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getLoanType();
  }
  generalFilter() {
    this.getLoanType();
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
      this.getLoanType();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getLoanType();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getLoanType();
    }
  }

  editLoanType(id: number) {
    this._route.navigateByUrl(`/connect/console/update-loan-type/${id}`);
  }
  deleteLoanType(id: any) {

    this._loanTS.deleteLoanType(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const locations = this. loanTypeItems.filter((item: any) => item.locationId !== id);
        // this. loanTypeItems = locations;
        this.getLoanType();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Loan Type Deleted Successfully!" }
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
