import { Component } from '@angular/core';
import { CurrencyTypesService } from '../../services/currency-types.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-currency-types',
  templateUrl: './currency-types.component.html',
  styleUrls: ['./currency-types.component.css']
})
export class CurrencyTypesComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  currencyTypeItems: any = [];
  desColumns = ['currencyName', 'currencyCode'];
  columnNames = ['Currency Name', 'Currency Code'];
  toastData: any = {};
  constructor(private _currencyS: CurrencyTypesService, private _r: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Currency Types',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getCurrencyTypes();
  }

  getCurrencyTypes() {
    this.spinner.show();
    this._currencyS.getAllCurrencyTypes(this.pageNumber, this.pageSize).subscribe((res) => {
      this.currencyTypeItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
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
      this.getCurrencyTypes();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getCurrencyTypes();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getCurrencyTypes();
    }
  }

  editCurrencyType(id: number) {
    this._r.navigateByUrl(`/connect/console/update-currency-type/${id}`);
  }
  deleteCurrencyType(id: any) {
    
    this._currencyS.deleteCurrencyType(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const countries = this.countryItems.filter((item: any) => item.countryId !== id);
        // this.countryItems = countries;
        this.getCurrencyTypes();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Currency Type Deleted Successfully!" }
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

