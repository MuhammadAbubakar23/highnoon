import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImportantLinksService } from '../../services/important-links.service';

@Component({
  selector: 'app-important-links',
  templateUrl: './important-links.component.html',
  styleUrls: ['./important-links.component.css']
})
export class ImportantLinksComponent {

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = '';
  importantLinkItems: any = [];
  desColumns = ['linkURL'];
  columnNames = ['Link URL'];

  constructor(private _ImportantLinks: ImportantLinksService, private _route: Router, private _toastS: ToasterService,
    _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Important Links',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getImportantLinks();
  }

  getImportantLinks() {
    this.spinner.show();
    this._ImportantLinks.getImportantLinks(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.importantLinkItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getImportantLinks();
  }
  generalFilter() {
    this.getImportantLinks();
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
      this.getImportantLinks();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getImportantLinks();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getImportantLinks();
    }
  }

  editImportantLink(id: number) {
    this._route.navigateByUrl(`/connect/console/update-important-link/${id}`);
  }
  deleteImportantLink(id: any) {
    
    this._ImportantLinks.deleteImportantLink(id).subscribe((res) => {
      if (res.statusCode === 200) {
        this.getImportantLinks();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Important Link Deleted Successfully!" }
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
