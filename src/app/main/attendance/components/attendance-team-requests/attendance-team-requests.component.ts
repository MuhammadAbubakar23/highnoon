import { Component, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { AttendanceService } from '../../services/attendance.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-attendance-team-requests',
  templateUrl: './attendance-team-requests.component.html',
  styleUrls: ['./attendance-team-requests.component.css']
})
export class AttendanceTeamRequestsComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  searchText = "";
  startDate = "";
  endDate = "";
  locationId = 0;
  leaveType = 0;
  leaveStatus = 0;
  sortBy = "";
  attendanceTeamItems: any = [];
  desColumns = ['attendanceDate', 'name', 'checkInTime', 'checkOutTime', 'status'];
  columnNames = ['Date', 'Name', 'Check-In', 'Check-Out', 'Status'];
  sortingColumns = ["UserName", "DateTime", "CheckIn", "CheckOut", "Status"]
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  currentRequestStageId = 0;
  requesterDetails: any = {};
  summaryItem: any = [];
  requestStages: any = [];
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
  constructor(private _hS: HeaderService, private _aS: AttendanceService, private datePipe: DatePipe, private _toastS: ToasterService,
    private _dTFS: DateTimeFormatService, private _per: MenuPermissionService, private _route: Router) {
    {
      let tabs = [];
      let isTabActive = true;
      if (this._per.hasPermission('My Attendance')) {
        tabs.push({ title: 'My Attendance', url: 'connect/attendance', isActive: false }, { title: 'My Requests', url: 'connect/attendance/my-requests', isActive: false })
      }
      if (this._per.hasPermission('Team Attendance')) {
        tabs.push({ title: 'Team Requests', url: 'connect/attendance/team-requests', isActive: true }, { title: 'Team Attendance', url: 'connect/attendance/team-attendance', isActive: false })
      }
      else {
        this._route.navigateByUrl('/connect/attendance');
      }
      this._hS.updateHeaderData({
        title: 'Attendance',
        tabs: tabs,
        isTab: isTabActive,
      })
    }
  }

  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getTeamAttendanceRequests();
  }
  getTeamAttendanceRequests() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.searchText,
      startDate: this.startDate,
      endDate: this.endDate,
      locationId: this.locationId,
      sortBy: this.sortBy
    }
    console.log("data", data)
    this._aS.getAllTeamAttendanceRequests(data).subscribe((res) => {
      console.log("Team Attendance", res);
      this.attendanceTeamItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
      this.attendanceTeamItems.forEach(element => {
        if (element.attendanceDate !== null) {
          element.attendanceDate = this.datePipe.transform(element.attendanceDate, 'MMM dd, yyyy');
        }
        if (element.checkInTime !== null) {
          element.checkInTime = moment(element.checkInTime).format("h:mm:ss A");
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
      this.getTeamAttendanceRequests();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getTeamAttendanceRequests();
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
      this.getTeamAttendanceRequests();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeamAttendanceRequests();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getTeamAttendanceRequests();
    }
  }

  updateRequestStageId(id: number) {
    this.currentRequestStageId = id;
    this.teamRequestForm.reset();
  }

  getTeamSummary(requester, content) {
    debugger
    this.openEnd(content);
    this.teamRequestForm.reset();
    this.currentRequestStageId = requester.requestStage.requestStageId;
    this.summaryItem = requester;
    this._aS.getAttendanceRequestSummary(requester.attendanceRequestId).subscribe(res => {

      let shiftHours;
      if (res.data.checkInTime !== null && res.data.checkOutTime !== null) {
        const shiftStart = moment(res.data.checkInTime).format("h:mm A");
        const shiftEnd = moment(res.data.checkOutTime).format("h:mm A");
        shiftHours = this._dTFS.calculateHourDifference(shiftStart, shiftEnd);
      }
      if (res.data.checkInTime !== null) {
        // res.data.checkInTime = moment(res.data.checkInTime).format("h:mm A")
        res.data.checkInTime = moment(res.data.checkInTime, "h:mm:ss").format("h:mm:ss A")
      }
      if (res.data.checkOutTime !== null) {
        // res.data.checkOutTime = moment(res.data.checkOutTime).format("h:mm A")
        res.data.checkOutTime = moment(res.data.checkOutTime, "h:mm:ss").format("h:mm:ss A")
      }
      if (res.data.curCheckInTime) {
        // res.data.curCheckInTime = moment(res.data.curCheckInTime).format("h:mm A")
        res.data.curCheckInTime = moment(res.data.curCheckInTime, "h:mm:ss").format("h:mm:ss A")
      }
      if (res.data.curCheckOutTime !== null) {
        // res.data.curCheckOutTime = moment(res.data.curCheckOutTime).format("h:mm A")
        res.data.curCheckOutTime = moment(res.data.curCheckOutTime, "h:mm:ss").format("h:mm:ss A")
      }

      let scheduledShiftStartTime: any = "";
      let scheduledShiftEndTime: any = "";
      res.data.scheduleDetails.forEach((schedule) => {
        if (schedule.shiftStart != null) {
          scheduledShiftStartTime = schedule.shiftStart;
        }
        if (schedule.shiftEnd != null) {
          scheduledShiftEndTime = schedule.shiftEnd;
        }
      })

      let scheduledShiftHours;
      if (scheduledShiftStartTime !== null && scheduledShiftEndTime !== null) {
        scheduledShiftStartTime = moment(scheduledShiftStartTime).format("h:mm A");
        scheduledShiftEndTime = moment(scheduledShiftEndTime).format("h:mm A");
        scheduledShiftHours = this._dTFS.calculateHourDifference(scheduledShiftStartTime, scheduledShiftEndTime);
      }

      let existingStartTimeGap = this._dTFS.calculateHourDifference(scheduledShiftStartTime, res.data.curCheckInTime);;
      let existingEndTimeGap = this._dTFS.calculateHourDifference(scheduledShiftEndTime, res.data.curCheckOutTime);

      let extraHours = this.extraHours(shiftHours, scheduledShiftHours);
      let startTimeGap = this._dTFS.calculateHourDifference(scheduledShiftStartTime, res.data.checkInTime);
      let endTimeGap = this._dTFS.calculateHourDifference(scheduledShiftEndTime, res.data.checkOutTime);

      this.requesterDetails = {
        "checkInTime": res.data.checkInTime,
        "checkOutTime": res.data.checkOutTime,
        "shiftHours": shiftHours,
        "notes": res.data.notes,
        "requester": res.data.requester,
        "curCheckInTime": res.data.curCheckInTime,
        "curCheckOutTime": res.data.curCheckOutTime,
        "existingStartTimeGap": existingStartTimeGap,
        "existingEndTimeGap": existingEndTimeGap,
        "extraHours": extraHours,
        "startTimeGap": startTimeGap,
        "endTimeGap": endTimeGap,
        appliedDate: this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
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
      console.log("requestStages", this.requestStages)
    })
  }

  extraHours(shiftHours: any, scheduledShiftHours: any) {
    let shiftHoursMinutes = this.convertToMinutes(shiftHours);
    let scheduledShiftHoursMinutes = this.convertToMinutes(scheduledShiftHours);
    let extraHoursMinutes = shiftHoursMinutes - scheduledShiftHoursMinutes;
    return {
      hours: extraHoursMinutes / 60,
      minutes: extraHoursMinutes % 60
    };
  }

  convertToMinutes(shiftHours: any) {
    return shiftHours.hours * 60 + shiftHours.minutes;
  }

  updateRequest(reqstageId: number, statusId: number, content) {
    this.closeOffset(content)
    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._aS.updateRequestStage(data).subscribe((res) => {
      if (res.statusCode === 200) {
        let message = ""
        if (statusId === 2) {
          message = "You have approved the attendance request successfully."
        }
        if (statusId === 3) {
          message = "You have rejected the attendance request."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getTeamAttendanceRequests();
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
    this._aS.getTeamAttendanceReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'AttendanceDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}

