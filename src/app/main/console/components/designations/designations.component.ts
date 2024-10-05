import { Component, OnInit, } from '@angular/core';
import { DesignationService } from '../../services/designation.service';

import { ActivatedRoute, Router } from '@angular/router';

import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent implements OnInit {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  desginationItems: any = [];
  desColumns = ['title', 'grade'];
  columnNames = ['Title', 'Grade'];
  constructor(private _designationS: DesignationService, private _route: Router, private _toastS: ToasterService, private _hS: HeaderService
    , private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Designations',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getDesginations();
  }

  getDesginations() {
    this.spinner.show();
    this._designationS.getDesignations(this.pageNumber, this.pageSize).subscribe((res) => {
      this.desginationItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getDesginations();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getDesginations();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getDesginations();
    }
  }
  editDesignation(id: number) {
    this._route.navigateByUrl(`/connect/console/update-designation/${id}`);
  }
  deleteDesignation(id: any) {
    this._designationS.deleteDesignation(id).subscribe((res) => {
      if (res.statusCode === 200) {
        this.getDesginations();
        //const designations = this.desginationItems.filter((item: any) => item.designationId !== id);
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Designation Deleted Successfully!" }
        this._toastS.updateToastData(toasterObject)
        //this.desginationItems = designations;
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
