import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AttendanceService } from 'src/app/main/attendance/services/attendance.service';
import { SelfTeamRequestsComponent } from 'src/app/main/employee-self-services/components/self-team-requests/self-team-requests.component';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { CustomValidators } from 'src/app/validators/custom.validators';
import { DashboardService } from '../../services/dashboard.service';
import { ImportantLinksService } from 'src/app/main/console/services/important-links.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {
  startDate = "";
  endDate = "";
  recentCheckIn = "";
  recentCheckOut = "";
  recentCheckInTime = "";
  recentCheckOutTime = "";
  importantLinkItems: any;
  totalPages: any;
  totalRecords: any;
  pageNumber: any = 0;
  pageSize: any = 0;
  isButtonDisabled = false;
  totalHours = 0;
  currentId = 0;
  locations: any[] = [];
  birthdays: any[] = [];
  filteredBirthdays: any[] = [];
  benefits: any[] = [{ icon: 'icon', type: 'check' }];
  checkOutAt = "";
  checkInAt = "";
  vaccantJobs: any[] = [];
  bsInlineValue = new Date();
  hierarchy: any = {};
  currentDayAttendance: any = {};
  userName: string = "";
  filterDate: any = new Date();
  addAttendanceForm: FormGroup = new FormGroup(
    {
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
  constructor(private _aS: AttendanceService, private _dFS: DateTimeFormatService, private datePipe: DatePipe, private _toastS: ToasterService, private _dropdownS: DropDownApiService,
    private _hS: HeaderService, private _dashS: DashboardService, private _iL: ImportantLinksService) {

    _hS.updateHeaderData({
      title: 'My Dashboard',
      icon: '<i class="fa-light fa-gauge"></i>',
      tabs: [{ title: '', url: '/connect/dashborad/my-dashboard', isActive: SelfTeamRequestsComponent }],
      isTab: false,
    })
  }


  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getAttendance();
    this.getVacantJobs();
    this.getImportantLinks();
    this.getBirthDays();
    this.getBenefits();
    this.reportingHierarchy();
    this.getLocations();
    this.userName = localStorage.getItem('username');
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

  getAttendance() {
    debugger
    console.log("this.filterDate", this.filterDate)
    const formattedDate = moment(this.filterDate).format("YYYY-MM-DD");
    this._dashS.getLatestChecks(formattedDate).subscribe((res) => {
      if (res.data) {
        if (res.data.attendanceDate) {
          const attendanceDate = new Date(res.data.attendanceDate);
          const parsedattendanceDate = this.datePipe.transform(attendanceDate, 'yyyy-MM-dd');
          res.data.attendanceDate = parsedattendanceDate
        }
        this.currentId = res.data.attendanceId
        this.addAttendanceForm.patchValue({
          checkInDateTime: res.data.checkInTime,
          attendanceDate: res.data.attendanceDate,
          checkOutDateTime: res.data.checkOutTime,
          checkInLocation: res.data.checkInLoc,
          checkOutLocation: res.data.checkOutLoc,
          note: res.data.notes
        });
        if (res.data.checkInTime !== null) {
          this.recentCheckIn = moment(res.data.checkInTime).format("MMM D, YYYY h:mm A");;
          this.recentCheckInTime = moment(res.data.checkInTime).format("h:mm A");
        }
        if (res.data.checkOutTime !== null) {
          this.recentCheckOut = moment(res.data.checkOutTime).format("MMM D, YYYY h:mm A");;
          this.recentCheckOutTime = moment(res.data.checkOutTime).format("h:mm A");
        }
        if (res.data.checkInTime !== null && res.data.checkOutTime) {
          const rStart = moment(res.data.checkInTime).format("h:mm A");
          const rEnd = moment(res.data.checkOutTime).format("h:mm A");
          const { hours } = this._dFS.calculateHourDifference(rStart, rEnd);
          this.totalHours = hours;
        }
      }

    }, (err: any) => {
      console.log("Error", err);
    })
  }
  filterData(event: Date) {
    //const parsedDate = moment(event);

    this.filterDate = event;
    this.getAttendance();
    this.filterBirthDays();
  }
  filterBirthDays() {


    const filteredBirthdays = this.birthdays.filter((item) => {
      const birthDate = new Date(item.birthDate);
      return birthDate.getMonth() === new Date(this.filterDate).getMonth() && birthDate.getDate() === new Date(this.filterDate).getDate();
    });

    this.filteredBirthdays = filteredBirthdays.map(item => ({ ...item }));
  }




  getVacantJobs() {
    this._dashS.getVacantJobs().subscribe((res) => {
      this.vaccantJobs = res.data;
    })
  }
  getBirthDays() {
    this._dashS.getBirthdays().subscribe((res) => {
      this.birthdays = res.data;
      this.filterBirthDays();
    })
  }
  getBenefits() {
    this._dashS.getBenefits().subscribe((res) => {
      res.data.forEach((item) => {
        if (item.type.trim() === 'Official Vehicle Request') {
          item.icon = 'fa-light fa-car';
        } else if (item.type.trim() === 'Employee Interest Free Loan') {
          item.icon = 'fa-light fa-money-bill';
        } else if (item.type.trim() === 'Official Mobile Package') {
          item.icon = 'fa-light fa-mobile-alt';
        } else if (item.type.trim() === 'Mobile Allowance Request') {
          item.icon = 'fa-light fa-mobile';
        } else if (item.type.trim() === 'Internet Device') {
          item.icon = 'fa-light fa-wifi';
        } else if (item.type.trim() === 'Apply Fuel Card') {
          item.icon = 'fa-light fa-gas-pump';
        } else if (item.type.trim() === 'Subsidized Medicine') {
          item.icon = 'fa-light fa-medkit';
        }
      });

      this.benefits = res.data;
    })
  }
  reportingHierarchy() {
    const userId = localStorage.getItem('userId')
    this._dashS.getReportingHierarchy(userId).subscribe((res) => {
      // res.data.sharingManager=[{"userId": 4260,
      // "name": "Manager1",
      // "designation": "Senior Area Sales Manager",
      // "firstNameLetter": "Q",
      // "lastNameLetter": ""},{"userId": 4260,
      // "name": "Manager2",
      // "designation": "Senior Area Sales Manager",
      // "firstNameLetter": "Q",
      // "lastNameLetter": ""},{"userId": 4260,
      // "name": "Manager3",
      // "designation": "Senior Area Sales Manager",
      // "firstNameLetter": "Q",
      // "lastNameLetter": ""},{"userId": 4260,
      // "name": "Manager4",
      // "designation": "Senior Area Sales Manager",
      // "firstNameLetter": "Q",
      // "lastNameLetter": ""}];
      // res.data.reporty=[{"userId": 4260,
      // "name": "reporty1",
      // "designation": "Senior Area Sales Manager",
      // "firstNameLetter": "Q",
      // "lastNameLetter": ""},{"userId": 4260,
      // "name": "reporty2",
      // "designation": "Senior Area Sales Manager",
      // "firstNameLetter": "Q",
      // "lastNameLetter": ""},{"userId": 4260,
      // "name": "reporty3",
      // "designation": "Senior Area Sales Manager",
      // "firstNameLetter": "Q",
      // "lastNameLetter": ""},{"userId": 4260,
      // "name": "reporty4",
      // "designation": "Senior Area Sales Manager",
      // "firstNameLetter": "Q",
      // "lastNameLetter": ""}]
      this.hierarchy = res.data;
    })
  }

  getLocations() {
    this._dropdownS.getLocationsforDDD().subscribe((res) => {
      this.locations = res.data;
    })
  }
  addCustomValidator() {
    const checkOutDateTime = this.addAttendanceForm.get('checkOutDateTime').value;
    if (checkOutDateTime !== null) {
      this.addAttendanceForm.setValidators(
        CustomValidators.dateValidator('checkInDateTime', 'checkOutDateTime')
      );
      this.addAttendanceForm.updateValueAndValidity();
    }
  }
  checkInChange() {

    console.log("this.addAttendanceForm.get('checkOutDateTime').value", this.addAttendanceForm.value['checkInDateTime'])
    this.recentCheckInTime = moment(this.addAttendanceForm.value['checkInDateTime']).format("h:mm A");
  }
  checkOut() {
    const checkOutDateTime = this.addAttendanceForm.get('checkOutDateTime').value;
    if (checkOutDateTime !== null) {
      this.addAttendanceForm.setValidators(CustomValidators.dateValidator('checkInDateTime', 'checkOutDateTime'));
      this.addAttendanceForm.updateValueAndValidity();
    }
    this.checkOutAt = this.addAttendanceForm.get('checkOutDateTime').value;
    this.checkOutAt = moment(this.checkOutAt).format("h:mm A");
  }
  get aF() {
    return this.addAttendanceForm.controls
  }
  resetForm() {
    this.addAttendanceForm.reset({
      checkInDateTime: null,
      attendanceDate: '',
      checkOutDateTime: null,
      checkInLocation: "",
      checkOutLocation: "",
      note: ''
    });
    this.addAttendanceForm.clearValidators();
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
          "notes": this.addAttendanceForm.get('note').value
        };
        this._aS.updateAttendance(data).subscribe((res) => {
          this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            this.closeOffset(content)
            this.getAttendance();
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Attendance Updated Successfully!" }
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
      else {


        const data = {
          "attendanceId": 0,
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
          "notes": this.addAttendanceForm.get('note').value
        };
        console.log("Attendance data", data)
        this._aS.createAttendance(data).subscribe((res) => {
          this.isButtonDisabled = false;
          console.log(res)
          if (res.statusCode === 200) {
            this.closeOffset(content)
            this.getAttendance();
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

  getImportantLinks() {
    this._iL.GetImportantLinks().subscribe((res) => {
      this.importantLinkItems = res.data;
    })
  }
}
