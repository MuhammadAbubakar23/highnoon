import { DatePipe } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import * as moment from 'moment';
import { LeaveUtilizationService } from '../../services/leave-utilization.service';
import { Router } from '@angular/router';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lfa-team',
  templateUrl: './lfa-team.component.html',
  styleUrls: ['./lfa-team.component.css']
})
export class LfaTeamComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage = 10;
  text = "";
  startDate = "";
  endDate = "";
  resRemainingLeaves = 0;
  reslfaAmount = 0;
  year = new Date().getFullYear();
  currentDate = new Date();
  sortBy = "";
  lfaItems: any = [];
  desColumns = ['deadLineDate', 'remainingLeaves', 'year', 'payPerLeave', 'overAllTax', 'encashmentAmount', 'status'];
  columnNames = ['Deadline', 'REMAINING LEAVES', 'Year', 'Pay Per Leaves', 'Overall Tax (5%)', 'LFA Amount', 'Status'];
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  totalRequest: number = 0;
  requesterDetails: any = {};
  summaryItem: any = {};
  requestStages: any = [];
  currentRequestStageId = 0;
  utilizationType = 3;
  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
        Validators.maxLength(200)])
    }
  )
  get rF() {
    return this.teamRequestForm.controls;
  }
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
      this.offcanvasService.open(content, { position: 'end' });
    }
   closeOffset(content: TemplateRef<any>) {
      this.offcanvasService.dismiss(content);
    }
  constructor(private _hS: HeaderService, private _lUS: LeaveUtilizationService, private _toastS: ToasterService,
    private datePipe: DatePipe, private spinner: NgxSpinnerService, private _per: MenuPermissionService, private _route: Router) {
      let tabs = [];
      let isTabActive = true;
      if (this._per.hasPermission('My Leaves')) {
        tabs.push({ title: 'LFA', url: 'connect/leaves/lfa-amount', isActive: false })
      }
      if (this._per.hasPermission('Team Leaves')) {
        tabs.push( { title: 'Team Requests', url: 'connect/leaves/lfa-amount/team-requests', isActive: true })
      }
      else {
        isTabActive = false;
      }
      this._hS.updateHeaderData({
        title: 'Leave Fair Assistance Amount',
        tabs: tabs,
        isTab: isTabActive,
      })
  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getTeamLeaves();
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
      this.getTeamLeaves();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeamLeaves();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getTeamLeaves();
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
      this.getTeamLeaves();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  getTeamLeaves() {
    const data = {
      "pageNumber": this.pageNumber,
      "pageSize": this.pageSize,
      "utilType": this.utilizationType,
      "searchText": this.text
    }
    //this.spinner.show();
    this._lUS.getTeamLeaveUtilizations(data).subscribe((res) => {
      this.lfaItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.lfaItems.forEach(element => {
        if (element.deadLineDate) {
          element.deadLineDate = this.datePipe.transform(element.deadLineDate, 'MMM dd, yyyy');
        }
        if (element.leaveStatusId === 1) {
          element.leaveStatus = 'Pending';
        }
        if (element.leaveStatusId === 2) {
          element.leaveStatus = 'Approved';
        }
        if (element.leaveStatusId === 3) {
          element.leaveStatus = 'Rejected';
        }
      });
      this.resRemainingLeaves = res.remainingLeaves;
      this.reslfaAmount = res.encashmentAmount;

      this.spinner.hide();

    })

  }

  generalFilter() {
    this.getTeamLeaves();
  }


  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getTeamLeaves();
  }

  updateRequest(reqstageId: number, statusId: number,content) {

    this.closeOffset(content)
    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._lUS.updateRequestStage(data).subscribe((res) => {
      if (res.statusCode === 200) {
        let message = ""
        if (statusId === 2) {
          message = "You have approved the LFA successfully."
        }
        if (statusId === 3) {
          message = "You have rejected the LFA."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getTeamLeaves();
        this._toastS.updateToastData(toasterObject);
        this._toastS.hide();
      }
      if (res.statusCode === 404) {

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
  getLeaveSummary(requester,content) {
    this.openEnd(content);
    this.teamRequestForm.reset();
    this.currentRequestStageId = requester.requestStage.requestStageId;
    this.summaryItem = requester;
    this._lUS.getLeaveUtilRequestSummary(requester.leaveUtilizationId).subscribe(res => {
      this.requesterDetails = {
        "year": res.data.year,
        "requester": res.data.requester,
        "remainingLeaves": res.data.remainingLeaves,
        "payPerLeave": res.data.payPerLeave,
        "overAllTax": res.data.overAllTax,
        "encashmentAmount": res.data.encashmentAmount,
        "appliedDate": this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
      }

      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate = this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate = this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
    })
  }
  exportData() {

    const obj = {
      "utilType": this.utilizationType,
      "searchText": ""
    }

    this._lUS.getLeaveUtilizationReport(obj).subscribe((res: any) => {
      const a = document.createElement('a');
      a.href = res;
      a.download = 'LFADataReport' + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

}
