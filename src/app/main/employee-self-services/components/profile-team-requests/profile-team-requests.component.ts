import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';



import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Status } from 'src/app/shared/models/statuss';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile-team-requests',
  templateUrl: './profile-team-requests.component.html',
  styleUrls: ['./profile-team-requests.component.css']
})
export class ProfileTeamRequestsComponent {
  profileItems: any = [];
  // sortingColumns=["Date","Type","Duration", "Status"];
  desColumns = ["createdDate", "userName", "status"];
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
  currentRequestStageId = 0;
  summaryItem: any = {};
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
      Validators.maxLength(200)])
    }
  )
  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _pS: ProfileService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private _dropDown: DropDownApiService, private _per: MenuPermissionService, private _route: Router) {

    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Profile')) {
      tabs.push({ title: 'My Profile', url: 'connect/employee-self-services/my-information', isActive: false }, { title: 'My Requests', url: 'connect/employee-self-services/profile-requests', isActive: false })
    }
    if (this._per.hasPermission('Team Profile')) {
      tabs.push({ title: 'Team Requests', url: 'connect/employee-self-services/profile-team-requests', isActive: true })
    }

    this._hS.updateHeaderData({
      title: 'Profile Details',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getTeamRequests();
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
  get rF() {
    return this.teamRequestForm.controls;
  }

  calculateSerialNumber(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
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
      this.getTeamRequests();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeamRequests();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getTeamRequests();
    }
  }


  convertDateFormat(originalDate: string): string {
    const parsedDate = new Date(originalDate);
    const formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
    return formattedDate || '';
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getTeamRequests();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  getTeamRequests() {
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

    this._pS.getTeamRequests(data).subscribe((res: any) => {
      this.spinner.hide();
      this.profileItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.profileItems.forEach(element => {
        element.createdDate = this.datePipe.transform(element.createdDate, 'MMM dd, yyyy')
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
    })

  }

  generalFilter() {
    this.getTeamRequests();
  }


  get statusKeys() {
    const keys = Object.keys(this.statuss);
    return keys
  }
  filterByStatus(key: any) {

    this.filterStatus = Number(this.statuss[key]);
    this.selectedfilterStatus = key;
    this.getTeamRequests();
  }

  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentMonthDateFormatted();
    this.sortBy = "";
    this.selectedfilterStatus = "Status";
    this.filterStatus=0;
    this.getTeamRequests();
  }
  redirectToSummary(id, requestStageId): void {
    debugger
    this._route.navigate(['/connect/employee-self-services/profile-team-requests/summary'], { queryParams: { Id: id, requestStageId: requestStageId } });
  }

  updateRequest(reqstageId: number, statusId: number) {
    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._pS.updateRequestStage(data).subscribe((res) => {
      if (res.statusCode === 200) {

        let message = ""
        if (statusId === 2) {
          message = "You have approved the Request successfully."
        }
        if (statusId === 3) {
          message = "You have rejected the Request."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getTeamRequests();
        this._toastS.updateToastData(toasterObject);
        this._toastS.hide();
      }
      else {

        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Failed", toastParagrahp: res.data }
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
  updateRequestStageId(id: number) {
    this.currentRequestStageId = id;
    this.teamRequestForm.reset();
  }
  getProfileTeamSummary(requester, content) {
    this.openEnd(content);
    this.teamRequestForm.reset();
    this.currentRequestStageId = requester.requestStage.requestStageId;
    this.summaryItem = requester;
    this._pS.getTeamRequestSummary(requester.leaveId).subscribe(res => {
      this.requesterDetails = {
        "leaveType": res.data.leaveType,
        "duration": res.data.duration,
        "startDate":   this.datePipe.transform(res.data.startDate, 'MMM dd, yyyy'),
        "endDate":   this.datePipe.transform(res.data.endDate, 'MMM dd, yyyy'),
        "reason": res.data.reason,
        "requesterId": res.data.requesterId,
        "requester": res.data.requester,
        "appliedDate":   this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy')
      }
      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =   this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate =   this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
    })
  }
  exportData() {

    const obj = {
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      sortBy: this.sortBy
    }

    this._pS.getTeamRequestReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'ProfileTeamRequestReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}



