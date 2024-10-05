import { Component } from '@angular/core';
import { BenefitTypeService } from '../../services/benefit-type.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-benefit-type',
  templateUrl: './benefit-type.component.html',
  styleUrls: ['./benefit-type.component.css']
})
export class BenefitTypeComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  benefitTypeItems: any = [];
  desColumns = ['type'];
  columnNames = ['Name'];
  toastData: any = {};
  text = '';
  constructor(private _benefitTypeS: BenefitTypeService, private _r: Router, private _toastS: ToasterService
    , private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Benefit Type',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

  }
  ngOnInit(): void {
    this.getBenefitType();
  }

  getBenefitType() {
    this.spinner.show();
    this._benefitTypeS.getBenefitType(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.benefitTypeItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getBenefitType();
  }
  generalFilter() {
    this.getBenefitType();
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
      this.getBenefitType();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getBenefitType();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getBenefitType();
    }
  }


  editBenefitType(id: number) {
    this._r.navigateByUrl(`/connect/console/update-benefit-type/${id}`);
  }
  deleteBenefitType(id: any) {
    
    this._benefitTypeS.deleteBenefitType(id).subscribe((res) => {
      if (res.statusCode === 200) {
        this.getBenefitType();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Benefit Type Deleted Successfully!" }
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
