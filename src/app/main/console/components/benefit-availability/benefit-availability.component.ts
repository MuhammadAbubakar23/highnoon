import { Component } from '@angular/core';
import { BenefitAvailabilityService } from '../../services/benefit-availability.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-benefit-availability',
  templateUrl: './benefit-availability.component.html',
  styleUrls: ['./benefit-availability.component.css']
})
export class BenefitAvailabilityComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  availibilityItems: any = [];
  text = '';
  desColumns = ["benefitType", "limit", "unit", "designation"];
  columnNames = ['Benefit Type', 'Limit', 'Unit', 'Designation'];
  toastData: any = {};
  constructor(private _bAS: BenefitAvailabilityService, private _r: Router, private _toastS: ToasterService
    , private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Benefit Availability',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

  }
  ngOnInit(): void {
    this.getBenefitAvailability();
  }

  getBenefitAvailability() {
    this.spinner.show();
    this._bAS.getBenefitAvailablities(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.availibilityItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getBenefitAvailability();
  }
  generalFilter() {
    this.getBenefitAvailability();
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
       this.getBenefitAvailability();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
       this.getBenefitAvailability();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
       this.getBenefitAvailability();
    }
  }
  editBenefitAvailability(id: number) {
    this._r.navigateByUrl(`/connect/console/update-benefit-availability/${id}`);
  }
  deleteBenefitAvailability(id: any) {

    this._bAS.deleteBenefitAvailability(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const categories=this.benefitTypeItems.filter((item:any)=>item.categoryId !== id);
        // this.benefitTypeItems=categories;
        this.getBenefitAvailability();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Benefit Availability Deleted Successfully!" }
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
