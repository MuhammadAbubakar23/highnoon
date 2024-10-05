import { Component } from '@angular/core';
import { EmployerService } from '../../services/employer.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.css']
})
export class EmployerComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  isToaster: boolean = false;
  employerItems: any = [];
  desColumns = ['employerName'];
  columnNames = ['Name'];

  constructor(private _emprS: EmployerService, private _route: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {

    _hS.updateHeaderData({
      title: 'Employer',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getEmployers();
  }

  getEmployers() {
    this.spinner.show();
    this._emprS.getEmployer(this.pageNumber, this.pageSize).subscribe((res) => {
      this.employerItems = res.data;
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
      this.getEmployers();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getEmployers();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getEmployers();
    }
  }
  editEmployer(id: number) {
    this._route.navigateByUrl(`/connect/console/update-employer/${id}`);
  }
  deleteEmployer(id: any) {
    
    this._emprS.deleteEmployer(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const employers = this.employerItems.filter((item: any) => item.employerId !== id);
        // this.employerItems = employers;
        this.getEmployers();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Employer Deleted Successfully!" }
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

