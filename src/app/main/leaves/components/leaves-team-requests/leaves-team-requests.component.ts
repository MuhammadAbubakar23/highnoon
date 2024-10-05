import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { LeavesService } from '../../services/leaves.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { Status } from '../../../../shared/models/statuss';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-leaves-team-requests',
  templateUrl: './leaves-team-requests.component.html',
  styleUrls: ['./leaves-team-requests.component.css']
})
export class LeavesTeamRequestsComponent implements OnInit {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage = 10;
  text = "";
  startDate = "";
  endDate = "";
  currentDate = new Date();
  selectedLeaveType = "";
  leaveTypes: any[] = [];
  selectedfilterStatus = "";
  statuss = Status;
  leaveType = 0;
  filterStatus = 0;
  sortBy = "";
  isActive = false;
  status: any;
  leaveTeamItems: any = [];
  summaryToggle: boolean = false;
  desColumns = ['date', 'userName', 'leavetype', 'leaveDuration', 'leaveStatus'];
  columnNames = ['Date', 'Name', 'Type', '	Duration', 'Status'];
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  totalRequest: number = 0;
  requesterDetails: any = {};
  summaryItem: any = {};
  requestStages: any = [];
  currentRequestStageId = 0;
  quota: any = [];
  remainingleaves = 0;
  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
        Validators.maxLength(200)])
    }
  )


  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  constructor(private _hS: HeaderService, private _lS: LeavesService, private _toastS: ToasterService, private _dropdownS: DropDownApiService
    , private datePipe: DatePipe, private spinner: NgxSpinnerService, private _per: MenuPermissionService, private _route: Router) {

    let tabs = [];
    let isTabActive = true;
    if (_per.hasPermission('My Leaves')) {
      tabs.push({ title: 'My Leaves', url: 'connect/leaves', isActive: false })
    }
    if (_per.hasPermission('Team Leaves')) {
      tabs.push({ title: 'Team Requests', url: 'connect/leaves/team-requests', isActive: true })
    }
    else {
      isTabActive = false;
      this._route.navigateByUrl('/connect/leaves');
    }
    this._hS.updateHeaderData({
      title: 'Leaves',
      tabs: tabs,
      isTab: isTabActive,
    })

    // _hS.updateHeaderData({
    //   title: 'Leaves',
    //   tabs: [{ title: 'My Leaves', url: 'connect/leaves', isActive: false }, { title: 'Team Requests', url: 'connect/leaves/team-requests', isActive: true }],
    //   isTab: true,
    // })
  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getLeavetypes();
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
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      leaveType: this.leaveType,
      leaveStatus: this.filterStatus,
      sortBy: this.sortBy
    }
    this.spinner.show();

    this._lS.getAllTeamLeaves(data).subscribe((res) => {

      this.spinner.hide();
      this.leaveTeamItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.leaveTeamItems.forEach(element => {
        element.date = this.datePipe.transform(element.leaveStartDate, 'MMM dd, yyyy'); + "-" + this.datePipe.transform(element.leaveEndDate, 'MMM dd, yyyy');
        if (element.leaveStatusId === 1) {
          element.leaveStatus = 'Pending';
        }
        if (element.leaveStatusId === 2) {
          element.leaveStatus = 'Approved';
        }
        if (element.leaveStatusId === 3) {
          element.leaveStatus = 'Rejected';
        }
        if (element.leaveStatusId === 4) {
          element.leaveStatus = 'Canceled';
        }
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;



    })

  }
  getLeavetypes() {
    this._dropdownS.getLeaveTypesForDD().subscribe((res) => {
      this.leaveTypes = res.data;

    })
  }
  generalFilter() {
    this.getTeamLeaves();
  }
  filterByLeaveType(leaveTypeName, leaveTypeId) {

    this.leaveType = Number(leaveTypeId);
    this.selectedLeaveType = leaveTypeName;
    this.getTeamLeaves();
  }
  get statusKeys() {
    const keys = Object.keys(this.statuss);
    return keys
  }
  filterByStatus(key: any) {

    this.filterStatus = Number(this.statuss[key]);
    this.selectedfilterStatus = key;
    this.getTeamLeaves();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentMonthDateFormatted();
    this.leaveType = 0;
    this.filterStatus = 0;
    this.selectedLeaveType = "Leaves Type";
    this.selectedfilterStatus = "Status";
    this.sortBy = "";
    this.getTeamLeaves();
  }


  updateRequest(reqstageId: number, statusId: number, content) {

    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._lS.updateRequestStage(data).subscribe((res) => {
      this.closeOffset(content)
      if (res.statusCode === 200) {

        let message = ""
        if (statusId === 2) {
          message = "You have approved the leave successfully."
        }
        if (statusId === 3) {
          message = "You have rejected the leave."
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
  getLeaveSummary(requester, content, stage) {
    this.isActive = stage.isActive;
    this.status= stage.status;
    this.openEnd(content);
    this.teamRequestForm.reset();
    this.currentRequestStageId = requester.requestStage.requestStageId;
    this.summaryItem = requester;
    this._lS.getLeaveRequestSummary(requester.leaveId).subscribe(res => {
      this.requesterDetails = {
        "leaveType": res.data.leaveType,
        "duration": res.data.duration,
        "startDate": this.datePipe.transform(res.data.startDate, 'MMM dd, yyyy'),
        "endDate": this.datePipe.transform(res.data.endDate, 'MMM dd, yyyy'),
        "reason": res.data.reason,
        "requesterId": res.data.requesterId,
        "requester": res.data.requester,
        "appliedDate": this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy')
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
      this._lS.getLeaveQoutaByEmployeeId(res.data.requesterId).subscribe((res) => {
        this.quota = res.leaveQuota;
        this.remainingleaves = res.remainingleaves;
      });
    })
  }
  exportData() {

    const obj = {
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      leaveType: this.leaveType,
      leaveStatus: this.filterStatus,
      sortBy: this.sortBy
    }

    this._lS.getTeamLeaveReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'LeaveDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}


