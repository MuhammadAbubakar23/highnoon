import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';


import { EmployeeService } from 'src/app/main/console/services/employee.service';
import * as moment from 'moment';
import { Status } from 'src/app/shared/models/statuss';

@Component({
  selector: 'app-profile-request',
  templateUrl: './profile-request.component.html',
  styleUrls: ['./profile-request.component.css']
})
export class ProfileRequestComponent implements OnInit {
  profileItems: any = [];
  // sortingColumns=["Date","Type","Duration", "Status"];
  desColumns = ["date","name","status"];
  columnNames = ['Date', 'Name', 'Status'];
  sortingColumns = ["Date", "Type", "Duration", "Status"]
  selectedfilterStatus = "";
  filterStatus = 0;
  statuss = Status;
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  text = "";
  startDate = "";
  endDate = "";
  currentDate = new Date();
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _pS: EmployeeService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private _dropDown: DropDownApiService, private _per: MenuPermissionService) {

    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Profile')) {
      tabs.push({ title: 'My Profile', url: 'connect/employee-self-services/my-information', isActive: false }, { title: 'My Requests', url: 'connect/employee-self-services/profile-requests', isActive: true })
    }
    if (this._per.hasPermission('Team Profile')) {
      tabs.push({ title: 'Team Requests', url: 'connect/employee-self-services/profile-team-requests', isActive: false })
    }

    this._hS.updateHeaderData({
      title: 'Profile Details',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getRequests();
  }

  getCurrentMonthDateFormatted() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const parsedstartDate = new Date(startOfMonth);
    const parsedendDate = new Date(endOfMonth);
    this.startDate = this.datePipe.transform(parsedstartDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(parsedendDate, 'yyyy-MM-dd');
  }
  getRequests() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.filterStatus,
      sortBy: this.sortBy
    }

    this.spinner.show();
    this._pS.getRequests(data).subscribe((res) => {

      this.profileItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.profileItems.forEach(element => {
        element.date = this.datePipe.transform(element.date,'MMM dd, yyyy')

      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
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
      this.getRequests();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getRequests();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getRequests();
    }
  }




  generalFilter() {
    this.getRequests();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getRequests();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }




  sortDataBy(columnName) {
    this.sortBy = columnName.trim();
    this.getRequests();
  }
  get statusKeys() {
    const keys = Object.keys(this.statuss);
    return keys
  }
  filterByStatus(key: any) {

    this.filterStatus = Number(this.statuss[key]);
    this.selectedfilterStatus = key;
    this.getRequests();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentMonthDateFormatted();
    this.sortBy = "";
    this.selectedfilterStatus = "Status";
    this.filterStatus=0;
    this.getRequests();
  }




  exportData() {

    const obj = {
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      sortBy: this.sortBy
    }
    this._pS.getProfileRequestsReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'Profile Request Report' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }

}


