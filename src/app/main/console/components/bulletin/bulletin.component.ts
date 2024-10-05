import { Component, OnInit, } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BulletinService } from '../../services/bulletin.service';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.component.html',
  styleUrls: ['./bulletin.component.css']
})
export class BulletinComponent implements OnInit {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = '';
  bulletinItems: any = [];
  desColumns = ['title', 'details', 'attachmentName'];
  columnNames = ['Title', 'Details', 'File'];
  constructor(private spinner: NgxSpinnerService, private bulletins: BulletinService, private _hS: HeaderService, private _toastS: ToasterService, private _route: Router) {
    _hS.updateHeaderData({
      title: 'Bulletins',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }

  ngOnInit() {
    this.getBulletins();
  }

  getBulletins() {
    this.spinner.show();
    this.bulletins.getAllBulletin(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.bulletinItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }

  resetinput(){
    this.text='';
    this.getBulletins();
  }
  generalFilter() {
    this.getBulletins();
  }

  editBulletin(id: number) {

    this._route.navigateByUrl(`/connect/console/update-bulletin/${id}`);
  }

  deleteBulletin(id: number) {
    this.bulletins.deleteBulletin(id).subscribe((res) => {
      if (res.statusCode === 200) {
        this.getBulletins();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Bulletin Deleted Successfully!" }
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
      this.getBulletins();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getBulletins();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getBulletins();
    }
  }

}
