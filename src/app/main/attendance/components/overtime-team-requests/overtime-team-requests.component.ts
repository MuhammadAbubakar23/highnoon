import { Component, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { OvertimeService } from '../../services/overtime.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-overtime-team-requests',
  templateUrl: './overtime-team-requests.component.html',
  styleUrls: ['./overtime-team-requests.component.css']
})
export class OvertimeTeamRequestsComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  searchText = "";
  startDate = "";
  endDate = "";
  sortBy = "";
  overtimeTeamItems: any = [];
  desColumns = ['overTimeDate', 'userName', 'hours', 'type', 'status'];
  columnNames = ['Date', 'Name', 'Hours', 'Type', 'Status'];
  sortingColumns = ["UserName", "DateTime", "Hours", "Type", "Status"]
  currentRequestStageId = 0;
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  itemsPerPage: number = 10;
  currentDate = new Date();
  overTimeStatus = 0;
  selectedSort = ""
  currentId = 0;
  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
        Validators.maxLength(200)])
    }
  )
  get rF() {
    return this.teamRequestForm.controls;
  }
  requesterDetails: any = {};
  summaryItem: any = {};
  requestStages: any = [];

  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
      this.offcanvasService.open(content, { position: 'end' });
    }
   closeOffset(content: TemplateRef<any>) {
      this.offcanvasService.dismiss(content);
    }
  constructor(private _hS: HeaderService, private _oS: OvertimeService, private _toastS: ToasterService, private _r: Router,  private _dDFS: DateTimeFormatService, private datePipe: DatePipe, private spinner: NgxSpinnerService, private _per: MenuPermissionService, private _route: Router) {
      let tabs = [];
      let isTabActive = true;
      if (this._per.hasPermission('My Overtime')) {
        tabs.push({ title: 'My Overtime', url: 'connect/attendance/overtime', isActive: false })
      }
      if (this._per.hasPermission('Team Overtime')) {
        tabs.push({ title: 'Team Requests', url: 'connect/attendance/overtime/team-requests', isActive: true }, { title: 'Team Overtime', url: 'connect/attendance/team-overtime', isActive: false })
      }
      else {
        isTabActive = false;
        this._route.navigateByUrl('/connect/attendance/overtime');
      }
      this._hS.updateHeaderData({
        title: 'Overtime Management',
        tabs: tabs,
        isTab: isTabActive,
      })
  }
  ngOnInit(): void {

    this.getCurrentMonthDateFormatted();
    this.getOvertimeTeamRequests();
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
  getOvertimeTeamRequests() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.searchText,
      startDate: this.startDate,
      endDate: this.endDate,
      overTimeStatus: this.overTimeStatus,
      sortBy: this.sortBy
    }
    console.log("data", data)
    this.spinner.show();
    this._oS.getTeamOvertime(data).subscribe((res) => {
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected;
      this.totalRequest = this.pending + this.approved + this.rejected;
      this.overtimeTeamItems = res.pagedReponse.data;
      this.overtimeTeamItems.forEach((element) => {
        if (element.overTimeDate) {
          element.overTimeDate =  this.datePipe.transform(element.overTimeDate, 'MMM dd, yyyy');

        }

        if (element.hours) {
          element.hours = element.hours;
        }
        if (element.status === 1) {
          element.status = 'Pending';
        }
        if (element.status === 2) {
          element.status = 'Approved';
        }
        if (element.status === 3) {
          element.status = 'Rejected';
        }
        if (element.type === 1) {
          element.type = 'Planned'
        }
        if (element.type === 2) {
          element.type = 'Un-Planned';
        }
      })
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
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
      this.getOvertimeTeamRequests();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getOvertimeTeamRequests();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getOvertimeTeamRequests();
    }
  }




  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.searchText = "";
    this.getCurrentMonthDateFormatted();
    this.overTimeStatus = 0;
    this.sortBy = "";
    this.getOvertimeTeamRequests();
  }
  generalFilter() {

    console.log("generalFilter", this.searchText)
    this.getOvertimeTeamRequests();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {

      console.log("filterByDate", this.startDate, this.endDate)
      this.getOvertimeTeamRequests();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  // filterByStatus(leaveStatusName, leaveStatusId) {
  //
  //   this.leaveStatus = Number(leaveStatusId);
  //   this.selectedLeaveStatus = leaveStatusName;
  //   console.log("filterByLeaveStatus", this.leaveStatus)
  //    this.getOvertimeTeamRequests();
  // }

  sortDataBy(columnName) {

    this.sortBy = columnName;
    this.getOvertimeTeamRequests();
  }
  adjustColumns() {

  }

  getOvertimeSummary(requester, content) {
    this.openEnd(content)
    this.teamRequestForm.reset();

    this.currentRequestStageId = requester.requestStage.requestStageId;
    this.summaryItem = requester;
    this._oS.getOvertimeRequestSummary(requester.overTimeId).subscribe(res => {

      if (res.data.overTimeType === 1) {
        res.data.overTimeType = 'Planned';
      }
      if (res.data.overTimeType === 2) {
        res.data.overTimeType = 'Un-Planned';
      }
      this.requesterDetails = {
        "hours":res.data.hours,
        "notes": res.data.notes,
        "requester": res.data.requester,
        "overTimeType": res.data.overTimeType,
        "appliedDate": moment(res.data.appliedDate).format("MMM D, YYYY h:mm A"),
      }
      console.log("hours----",this.requesterDetails.hours)
      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =   this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate =   this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
      console.log("requestStages", this.requestStages)
    })
  }
  updateRequestStageId(id: number) {
    this.currentRequestStageId = id;
    this.teamRequestForm.reset();
  }

  updateRequest(reqstageId: number, statusId: number, content) {

    this.closeOffset(content)
    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._oS.updateRequestStage(data).subscribe((res) => {
      if (res.statusCode === 200) {
        let message = ""
        if (statusId === 2) {
          message = "You have approved the Overrtime successfully."
        }
        if (statusId === 3) {
          message = "You have rejected the Overrtime."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getOvertimeTeamRequests();
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
  exportData() {
    const obj = {
      "startDate": this.startDate,
      "endDate": this.endDate
    };
    this._oS.getOvertimeReport(obj).subscribe((res: any) => {
      const a = document.createElement('a');
      a.href = res;
      a.download = 'OvertimeDataReport' + 'this.fromDate' + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  // exportData() {
  //   var obj = {
  //     fromDate: '',
  //     toDate: '',
  //     pageNumber: 0,
  //     pageSize: 0,
  //   };

  //   this._lS.exportDataApi(obj).subscribe((res: any) => {
  //     const a = document.createElement('a');
  //     a.href = res;
  //     a.download = 'LeaveDataReport' + 'this.fromDate' + '.csv';
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   });
  // }

}

