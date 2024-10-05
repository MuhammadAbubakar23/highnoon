

import { Component, Input, OnInit, TemplateRef, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { HeaderService } from 'src/app/services/header.service';
import { AttendanceService } from '../../services/attendance.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { ToasterService } from 'src/app/services/toaster.service';

import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomValidators } from 'src/app/validators/custom.validators';
import * as moment from 'moment';
import { DashboardService } from 'src/app/main/livedashborad/services/dashboard.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-attendance',
  templateUrl: './team-attendance.component.html',
  styleUrls: ['./team-attendance.component.css']
})
export class TeamAttendanceComponent implements OnInit {
  @Input() isTabs: boolean = true;
  isButtonDisabled = false;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  searchText = "";
  startDate = "";
  endDate = "";
  searchLocationId = 0;
  sortBy = "";
  attendanceTitle = "Add Atendance"
  locations: any = [];
  currentId = 0;
  employees: any = [];
  selectedLocation: string = "Location";
  attendanceItems: any = [];
  currentDayAttendance: any = {};
  desColumns = ['attendanceDate', 'checkInTime', 'checkInLocationName', 'checkOutTime', 'checkOutLocationName', 'totalHours'];
  columnNames = ['Date', 'Check-In', 'Check-In Location', 'Check-Out', 'Check-Out Location', 'Total Hours'];
  sortingColumns = ["DateTime", "CheckIn", "CheckInLocation", "CheckOut", "CheckOutLocation", "TotalHours"]
  checkOutAt = "";
  checkInAt = "";
  isHR: boolean = JSON.parse(localStorage.getItem('Roles')).some((obj) => obj.Name === "HR")

  addAttendanceForm: FormGroup = new FormGroup(
    {
      userId: new FormControl(0),
      checkInDateTime: new FormControl(null, [Validators.required]),
      attendanceDate: new FormControl("", [Validators.required]),
      checkOutDateTime: new FormControl(null),
      checkInLocation: new FormControl(""),
      checkOutLocation: new FormControl(""),
      note: new FormControl("", [Validators.required]),
    })
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  constructor(private _hS: HeaderService, private _aS: AttendanceService, private _dropdownS: DropDownApiService, private _dashS: DashboardService,
    private _toastS: ToasterService, private datePipe: DatePipe, private spinner: NgxSpinnerService, private _per: MenuPermissionService) {
  }

  ngOnInit(): void {
    if (this.isTabs === true) {
      let tabs = [];
      let isTabActive = true;
      if (this._per.hasPermission('My Attendance')) {
        tabs.push({ title: 'My Attendance', url: 'connect/attendance', isActive: false }, { title: 'My Requests', url: 'connect/attendance/my-requests', isActive: false })
      }
      if (this._per.hasPermission('Team Attendance')) {
        tabs.push({ title: 'Team Requests', url: 'connect/attendance/team-requests', isActive: false }, { title: 'Team Attendance', url: 'connect/attendance/team-attendance', isActive: true })
      }
      this._hS.updateHeaderData({
        title: 'Attendance',
        tabs: tabs,
        isTab: isTabActive,
      })
    }
    this.getCurrentMonthDateFormatted();
    this.getLocations();
    this.getAllTeamAttendance();
    this.getEmployees();
  }
  getEmployees() {

    debugger
    const data = {
      "shiftId": 0,
      "startDate": "2024-06-06T12:19:19.482Z",
      "endDate": "2024-06-06T12:19:19.482Z",
      "isHR": this.isHR
    }
    this._aS.getAttendanceEmployeeList(data).subscribe((res: any) => {
      this.employees = res.data;
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
  getAllTeamAttendance() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.searchText,
      startDate: this.startDate,
      endDate: this.endDate,
      locationId: this.searchLocationId,
      sortBy: this.sortBy
    }
    console.log("data", data)
    this.spinner.show();

    this._aS.getAllTeamAttendance(data).subscribe((res) => {
      this.spinner.hide();
      this.attendanceItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.getcurrentDayAttendance();
      this.attendanceItems.forEach(element => {
        if (element.attendanceDate !== null) {
          element.attendanceDate = this.datePipe.transform(element.attendanceDate, 'MMM dd, yyyy');;
        }
        // if (element.checkInTime !== null) {
        //   debugger
        element.checkInTime = moment(element.checkInTime).format("h:mm:ss A");
        //   console.log("CheckInTime: " + element.checkInTime)
        // }
        if (element.checkOutTime !== null) {
          element.checkOutTime = moment(element.checkOutTime).format("h:mm:ss A");
        }

      });
    }, (err: any) => {
      console.log("Error", err);
    })
  }

  getcurrentDayAttendance() {

    this._dashS.getLatestChecks(this.datePipe.transform(new Date(), 'yyyy-MM-dd')).subscribe((res) => {
      console.log(res.data);
      if (res.statusCode === 200) {
        if (res.data !== null) {
          this.currentId = res.data.attendanceId;
          if (res.data.checkInTime !== null) {
            this.currentDayAttendance['todayCheckInTime'] = moment(res.data.checkInTime).format("h:mm A");
            this.currentDayAttendance['todayCheckInDateTime'] = moment(res.data.checkInTime).format("MMM D, YYYY h:mm A");
            this.currentDayAttendance['todayFormcheckInTime'] = res.data.checkInTime;
            this.currentDayAttendance['checkInTime'] = moment(res.data.checkInTime).format("h:mm A")
          }
          else {
            this.currentDayAttendance['todayCheckInTime'] = null;
            this.currentDayAttendance['todayCheckInDateTime'] = null;
            this.currentDayAttendance['todayFormcheckInTime'] = null;
            this.currentDayAttendance['checkInTime'] = null;
          }
          if (res.data.checkOutTime !== null) {
            this.currentDayAttendance['todayCheckOutTime'] = moment(res.data.checkOutTime).format("h:mm A");
            this.currentDayAttendance['todayCheckOutDateTime'] = moment(res.data.checkOutTime).format("MMM D, YYYY h:mm A");
            this.currentDayAttendance['todayFormcheckOutTime'] = res.data.checkOutTime;
          }
          else {
            this.currentDayAttendance['todayCheckOutTime'] = null;
            this.currentDayAttendance['todayCheckOutDateTime'] = null;
            this.currentDayAttendance['todayFormcheckOutTime'] = null;
          }

          this.currentDayAttendance['todayFormattendanceDate'] = res.data.attendanceDate;
          this.currentDayAttendance['todayFormLocation'] = res.data.checkOutLocationId;
          this.currentDayAttendance['todayFormNote'] = res.data.notes;
          this.currentDayAttendance['attendanceDate'] = this.datePipe.transform(res.data.attendanceDate, 'yyyy-MM-dd');



        }

      }
    }, (err: any) => {
      console.log("Error", err);
    })

  }
  addCustomValidator() {
    const checkOutDateTime = this.addAttendanceForm.get('checkOutDateTime').value;
    if (checkOutDateTime !== null) {
      this.addAttendanceForm.setValidators(
        CustomValidators.dateValidatorforAttendance('checkInDateTime', 'checkOutDateTime')
      );
      this.addAttendanceForm.updateValueAndValidity();
    }
  }
  get isCheckoutGreater(): boolean {
    return (
      this.addAttendanceForm.getError('invalidDate') &&
      this.addAttendanceForm.get('checkOutDateTime').touched
    );
  }

  get isDurationOk(): boolean {
    return (
      this.addAttendanceForm.getError('invalidDuration') &&
      this.addAttendanceForm.get('checkOutDateTime').touched
    );
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
      this.getAllTeamAttendance();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getAllTeamAttendance();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getAllTeamAttendance();
    }
  }

  checkOut() {
    const checkOutDateTime = this.addAttendanceForm.get('checkOutDateTime').value;
    if (checkOutDateTime !== null) {
      this.addAttendanceForm.setValidators(CustomValidators.dateValidatorforAttendance('checkInDateTime', 'checkOutDateTime'));
      this.addAttendanceForm.updateValueAndValidity();
    }
    this.checkOutAt = this.addAttendanceForm.get('checkOutDateTime').value;
    this.checkOutAt = moment(this.checkOutAt).format("h:mm A");
  }
  getLocations() {
    this._dropdownS.getLocationsforDDD().subscribe((res) => {
      this.locations = res.data;
    })
  }

  generalFilter() {
    this.getAllTeamAttendance();
  }
  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getAllTeamAttendance();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  filterByLocation(location) {
    this.searchLocationId = location.locationId;
    this.selectedLocation = location.name;
    this.getAllTeamAttendance();
  }
  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getAllTeamAttendance();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.searchText = "";
    this.getCurrentMonthDateFormatted();
    this.searchLocationId = 0;
    this.selectedLocation = "Location"
    this.sortBy = "";
    this.getAllTeamAttendance();
  }
  getAttendanceDetails(id, content) {
    this.openEnd(content)
    this.resetForm();
    this.checkOutAt = null;
    this.currentId = id;
    this._aS.getAttendanceById(this.currentId).subscribe((res) => {
      this.checkInAt = moment(res.data.checkInTime).format("h:mm A");
      this.checkOutAt = moment(res?.data?.checkOutTime).format("h:mm A")
      this.attendanceTitle = "Update Attendance"
      const parsedDate = new Date(res.data.attendanceDate);
      debugger
      this.addAttendanceForm.patchValue({
        attendanceDate: this.datePipe.transform(parsedDate, 'yyyy-MM-dd'),
        checkInDateTime: res.data.checkInTime,
        checkOutDateTime: res.data.checkOutTime,
        checkInLocation: res.data.checkInLoc,
        checkOutLocation: res.data.checkOutLoc,
        location: res.data.checkInLoc,
        note: res.data.notes
      })
    })
  }
  get aF() {
    return this.addAttendanceForm.controls
  }
  resetForm() {
    this.addAttendanceForm.reset({
      userId: [],
      checkInDateTime: null,
      attendanceDate: '',
      checkOutDateTime: null,
      checkInLocation: "",
      checkOutLocation: "",
      note: ''
    });
    this.addAttendanceForm.clearValidators();
  }
  applyOffCanvas(content) {
    this.openEnd(content)
    this.currentId = 0;
    this.resetForm();
  }
  applyAddCheckoutCanvas(content) {
    this.openEnd(content)
    this.checkInAt = this.currentDayAttendance.todayCheckInTime;
    this.checkOutAt = this.currentDayAttendance.todayCheckOutTime;
    this.resetForm();
    this.addAttendanceForm.get('attendanceDate').setValue(this.currentDayAttendance.todayFormattendanceDate);
    this.addAttendanceForm.get('checkInDateTime').setValue(this.currentDayAttendance.todayFormcheckInTime);
    //this.addAttendanceForm.get('location').setValue(this.currentDayAttendance.todayFormLocation);
    //this.addAttendanceForm.get('location').setValue(this.currentDayAttendance.todayFormLocation);
    this.addAttendanceForm.get('note').setValue(this.currentDayAttendance.todayFormNote);
    const currentDayTime = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
    this.addAttendanceForm.get('checkOutDateTime').setValue(currentDayTime);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  submitForm(content) {
    debugger
    if (this.addAttendanceForm.valid) {
      this.isButtonDisabled = true;
      let checkInDateTime = this.addAttendanceForm.get('checkInDateTime').value;
      let checkOutDateTime = this.addAttendanceForm.get('checkOutDateTime').value;

      let attendanceDate = this.addAttendanceForm.get('attendanceDate').value;
      if (this.currentId !== 0 && this.currentId !== undefined) {
        const data = {
          "attendanceId": this.currentId,
          // "createdDate": checkInDateTime,
          "checkInTime": checkInDateTime,
          "checkOutTime": checkOutDateTime,
          "attendanceDate": attendanceDate,
          "userId": localStorage.getItem("userId"),
          "attendanceType": true,
          // "createdBy": 0,
          "checkInLocation": this.addAttendanceForm.get('checkInLocation').value,
          "checkOutLocation": this.addAttendanceForm.get('checkOutLocation').value,
          "attendanceSource": "Web",
          "notes": this.addAttendanceForm.get('note').value,
          'isHROrManager': this.isHR
        };
        this._aS.updateAttendance(data).subscribe((res) => {
          this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            this.closeOffset(content)
            this.getAllTeamAttendance();
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Attendance Updated Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
          }
          else if (res.statusCode === 400) {
            this.closeOffset(content)
            const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: res.message }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
          }

        }, (error: any) => {
          this.closeOffset(content)
          console.error("Internal Server Error", error);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
      else {


        const data = {
          "attendanceId": 0,
          // "createdDate": checkInDateTime,
          "checkInTime": checkInDateTime,
          "checkOutTime": checkOutDateTime,
          "attendanceDate": attendanceDate,
          "userId": this.addAttendanceForm.get('userId').value,
          "attendanceType": true,
          // "createdBy": 0,
          "checkInLocation": this.addAttendanceForm.get('checkInLocation').value,
          "checkOutLocation": this.addAttendanceForm.get('checkOutLocation').value,
          "attendanceSource": "Web",
          "notes": this.addAttendanceForm.get('note').value
        };
        console.log("Attendance data", data)
        this._aS.createTeamAttendance(data).subscribe((res) => {
          this.isButtonDisabled = false;
          console.log(res)
          if (res.statusCode === 200) {
            this.closeOffset(content)
            this.getAllTeamAttendance();
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Attendance Added Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
          }
          if (res.statusCode === 400) {
            this.closeOffset(content)
            const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: res.message }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
          }
        }, (error: any) => {
          this.closeOffset(content)
          console.error("Internal Server Error", error);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
    }

    else {
      this.markFormGroupTouched(this.addAttendanceForm);
    }


  }

  editAttendance(id: any, content) {

    this.currentId = id;
    this.getAttendanceDetails(this.currentId, content);
  }
  deleteAttendance(id: any) {
    this._aS.deleteAttendance(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const attendance = this.attendanceItems.filter((item: any) => item.attendanceId !== id);
        // this.attendanceItems = attendance;
        this.currentDayAttendance.todayCheckInDateTime = null;
        this.currentDayAttendance.todayCheckOutDateTime = null;
        this.getAllTeamAttendance();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Attendance Deleted Successfully!" }
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
    this._aS.getAttendanceReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'AttendanceDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }

  // exportData() {
  //
  //   const obj = {
  //     text: this.text,
  //     startDate: this.startDate,
  //     endDate: this.endDate,
  //     leaveType: this.leaveType,
  //     leaveStatus: this.leaveStatus,
  //     sortBy: this.sortBy
  //   }
  //   this._lS.getLeaveReport(obj).subscribe((res: any) => {
  //     const linkSource = res.data
  //     const downloadLink = document.createElement("a");
  //     const csvName = 'LeaveDataReport' + '.csv';
  //     downloadLink.href = linkSource;
  //     downloadLink.download = csvName ;
  //     downloadLink.click();
  //   });
  // }
}

