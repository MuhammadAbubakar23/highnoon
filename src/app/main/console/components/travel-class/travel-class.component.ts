import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TravelClassService } from '../../services/travel-class.service';
@Component({
  selector: 'app-travel-class',
  templateUrl: './travel-class.component.html',
  styleUrls: ['./travel-class.component.css']
})
export class TravelClassComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  travelClassItems: any = [];
  desColumns = ['travelClassName'];
  columnNames = ['Travel Class Name'];
  toastData: any = {};
  constructor(private _travelS: TravelClassService, private _r: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Travel Classes',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getTravelClasses();
  }

  getTravelClasses() {
    this.spinner.show();
    this._travelS.getAllTravelClasses(this.pageNumber, this.pageSize).subscribe((res) => {
      this.travelClassItems = res.data;
      console.log("travelClassItems",this.travelClassItems)
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
       this.getTravelClasses();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
       this.getTravelClasses();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
       this.getTravelClasses();
    }
  }


  editTravelClass(id: number) {
    this._r.navigateByUrl(`/connect/console/update-travel-class/${id}`);
  }
  deleteTravelClass(id: any) {
    this._travelS.deleteTravelClass(id).subscribe((res) => {
      if (res.statusCode === 200) {
        this.getTravelClasses();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Travel Class Deleted Successfully!" }
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
