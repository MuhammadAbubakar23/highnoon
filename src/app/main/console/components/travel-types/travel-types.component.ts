import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TravelTypesService } from '../../services/travel-types.service';

@Component({
  selector: 'app-travel-types',
  templateUrl: './travel-types.component.html',
  styleUrls: ['./travel-types.component.css']
})
export class TravelTypesComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  travelTypeItems: any = [];
  desColumns = ['travelByName'];
  columnNames = ['Travel Type Name'];
  toastData: any = {};
  constructor(private _travelS: TravelTypesService, private _r: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Travel Types',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getTravelTypes();
  }

  getTravelTypes() {
    this.spinner.show();
    this._travelS.getAllTravelTypes(this.pageNumber, this.pageSize).subscribe((res) => {
      this.travelTypeItems = res.data;
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
       this.getTravelTypes();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
       this.getTravelTypes();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
       this.getTravelTypes();
    }
  }


  editTravelType(id: number) {
    this._r.navigateByUrl(`/connect/console/update-travel-type/${id}`);
  }
  deleteTravelType(id: any) {

    this._travelS.deleteTravelType(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const countries = this.countryItems.filter((item: any) => item.countryId !== id);
        // this.countryItems = countries;
        this.getTravelTypes();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Travel Type Deleted Successfully!" }
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
