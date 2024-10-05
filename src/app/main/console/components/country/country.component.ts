import { Component } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  countryItems: any = [];
  desColumns = ['name'];
  columnNames = ['Name'];
  toastData: any = {};
  constructor(private _countryS: CountryService, private _r: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Countries',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getCountries();
  }

  getCountries() {
    this.spinner.show();
    this._countryS.getCountry(this.pageNumber, this.pageSize).subscribe((res) => {
      this.countryItems = res.data;
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
      this.getCountries();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getCountries();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getCountries();
    }
  }


  editCountry(id: number) {
    this._r.navigateByUrl(`/connect/console/update-country/${id}`);
  }
  deleteCountry(id: any) {

    this._countryS.deleteCountry(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const countries = this.countryItems.filter((item: any) => item.countryId !== id);
        // this.countryItems = countries;
        this.getCountries();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Country Deleted Successfully!" }
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

