import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { AttendanceService } from '../../services/attendance.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import * as moment from 'moment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-attendance-requests',
  templateUrl: './attendance-requests.component.html',
  styleUrls: ['./attendance-requests.component.css']
})
export class AttendanceRequestsComponent implements OnInit {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  searchText = "";
  startDate = "";
  endDate = "";
  sortBy = "";
  attendanceRequestItems: any = [];
  desColumns = ['attendanceDate', 'checkInTime', 'checkOutTime', 'totalHours', 'status'];
  columnNames = ['Date', 'Check-In', 'Check-Out', 'Total Hours', 'Status'];
  sortingColumns = [,"DateTime","CheckIn","CheckOut","TotalHours","Status"]
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
      this.offcanvasService.open(content, { position: 'end' });
    }
   closeOffset(content: TemplateRef<any>) {
      this.offcanvasService.dismiss(content);
    }
  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _aS: AttendanceService,
    private _per: MenuPermissionService,private _toastS:ToasterService
) {

      let tabs = [];
      let isTabActive = true;
      if (this._per.hasPermission('My Attendance')) {
        tabs.push({ title: 'My Attendance', url: 'connect/attendance', isActive: false }, { title: 'My Requests', url: 'connect/attendance/my-requests', isActive: true })
      }
      if (this._per.hasPermission('Team Attendance')) {
        tabs.push({ title: 'Team Requests', url: 'connect/attendance/team-requests', isActive: false },{ title: 'Team Attendance', url: 'connect/attendance/team-attendance', isActive: false })
      }
      this._hS.updateHeaderData({
        title: 'Attendance',
        tabs: tabs,
        isTab: isTabActive,
      })

 }

  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getAttendanceRequests();
  }
  getAttendanceRequests() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.searchText,
      startDate: this.startDate,
      endDate: this.endDate,
      locationId: 0,
      sortBy: this.sortBy
    }
    console.log("data", data)
    this._aS.getAllAttendanceRequests(data).subscribe((res) => {
      console.log("Team Attendance", res);

      this.attendanceRequestItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.attendanceRequestItems.forEach(element => {
        debugger
        element.attendanceDate =  this.datePipe.transform(element.attendanceDate, 'MMM dd, yyyy');

        if (element.checkInTime !== null) {
          element.checkInTime = moment(element.checkInTime).format("h:mm:ss A");;
        }

        if (element.checkOutTime !== null) {
          element.checkOutTime = moment(element.checkOutTime).format("h:mm:ss A");
        }
        // if (element.status === 1) {
        //   element.status = 'Pending';
        // }
        // if (element.status === 2) {
        //   element.status = 'Approved';
        // }
        // if (element.status === 3) {
        //   element.status = 'Rejected';
        // }
      });

      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
    })
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
  resetEndDate() {
    this.endDate = '';
  }
  filterByDate() {
    if (this.endDate >= this.startDate) {

      console.log("filterByDate", this.startDate, this.endDate)
      //this.getLeaves();
      //this.getLeaveQuote();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getAttendanceRequests()
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
      this.getAttendanceRequests();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getAttendanceRequests();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getAttendanceRequests();
    }
  }
  get isAllPending() {
    return this.requestStages.some((item) => item.status !== 1)
  }


  getattendancReqSummary(requester,content) {
    this.openEnd(content)
    this._aS.getAttendanceRequestSummary(requester.attendanceRequestId).subscribe(res => {
      this.requesterDetails = {
        attendanceId:requester.attendanceId,
        status:requester.status,
        checkInTime: moment(res.data.checkInTime).format("MMM D, YYYY h:mm A"),
        checkOutTime: moment(res.data.checkOutTime).format("MMM D, YYYY h:mm A"),
        notes: res.data.notes,
        requester: res.data.requester,
        curCheckInTime: null,
        curCheckOutTime: null,
        curAttendanceDate: null,
        appliedDate: this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),

      }
      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate = this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy')

        }
        else {
          stage.modifiedDate = this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy')
        }
      })
      this.requestStages = res.data.requestStages;
      console.log("requestStages", this.requestStages)
    })
  }
  cancelRequest(id: any,content) {

    this._aS.cancelRequest(id).subscribe((res) => {
      this.closeOffset(content)
      if (res.statusCode === 200) {
        // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
        // this.leaveItems = leaves;
        this.getAttendanceRequests();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Canceled", toastParagrahp: "Leave Canceled Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      }
    }, (error: any) => {

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
    this._aS.getAttendanceReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'AttendanceDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}

