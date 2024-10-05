import { Component, Input, OnInit, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { OvertimeService } from '../../services/overtime.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { CustomValidators } from 'src/app/validators/custom.validators';
import * as moment from 'moment';
import { Status } from 'src/app/shared/models/statuss';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from 'src/app/main/console/services/shift.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-overtime-management',
  templateUrl: './overtime-management.component.html',
  styleUrls: ['./overtime-management.component.css']
})
export class OvertimeManagementComponent implements OnInit {
  @Input() isTabs: boolean = true;
  isButtonDisabled = false;
  pageNumber = 1;
  today = new Date;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  searchText = "";
  startDate = "";
  endDate = "";
  sortBy = "";
  isHr = false;
  overtTimeItems: any = [];
  desColumns = ['overTimeDate', 'hours', 'type', 'status'];
  columnNames = ['Date', 'Hours', 'Type', 'Status'];
  sortingColumns = ["DateTime", "Type", "Status", "TotalHours"]
  isCanvas: boolean = false;
  totalRequest: number = 0;
  totalMonthsHours: any = "";
  approved: any = "";
  pending: any = "";
  rejected: any = "";
  plannedOvertime: any = "";
  remainingOvertime: any = "";
  totalOvertime: any = "";
  itemsPerPage: number = 10;
  overTimeStatus = 0;
  selectedOverTimeStatus = "";
  selectedSort = ""
  currentId = 0;
  Statuss = Status;
  requesterDetails: any = {};
  requestStages: any = [];
  scheduleId = 0;
  overTimeError = ""
  shiftItems: any = [];
  dateRange: string;
  userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 0;
  // overTimeForm = this.fb.group({
  //   overTimeId: 0,
  //   userId: [[this.userId]],
  //   scheduleId: 0,
  //   date: [this.today.toISOString()],
  //   type: 2,
  //   otStartDate: ['', Validators.required],
  //   otEndDate: '',
  //   otCheckIn: ["00:00:00", Validators.required],
  //   otCheckOut: ["00:00:00", Validators.required],
  //   otCheckInLoc: ["", Validators.required],
  //   otCheckOutLoc: ["", Validators.required],
  //   isWeekend: [false],
  //   notes: ['', Validators.required],
  //   overTimeDaysDtos: this.fb.array([]),
  //   overTimeHours: ["00:00:00", Validators.required]
  // })
    locations: any;

  // get invalidOvertimeError(): boolean {
  //   return (
  //     this.overTimeForm.getError('invalidOvertime')
  //   );
  // }
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  constructor(private _hS: HeaderService, private _oS: OvertimeService, private _toastS: ToasterService, private _dDFS: DateTimeFormatService, private datePipe: DatePipe, private spinner: NgxSpinnerService
    , private _per: MenuPermissionService, private shift: ShiftService, private fb: FormBuilder, private _dropdownS: DropDownApiService) {
  }
  ngOnInit(): void {
    this.calculateDateRange();

    if (this.isTabs === true) {
      let tabs = [];
      let isTabActive = true;
      if (this._per.hasPermission('My Overtime')) {
        tabs.push({ title: 'My Overtime', url: 'connect/attendance/overtime', isActive: true })
      }
      if (this._per.hasPermission('Team Overtime')) {
        tabs.push({ title: 'Team Requests', url: 'connect/attendance/overtime/team-requests', isActive: false }, { title: 'Team Overtime', url: 'connect/attendance/team-overtime', isActive: false })
      }
      else {
        isTabActive = false;
      }
      this._hS.updateHeaderData({
        title: 'Overtime Management',
        tabs: tabs,
        isTab: isTabActive,
      })
    }

    this.getCurrentMonthDateFormatted();
    // this.getLocations();
    this.getOvertime();
  }

  // getShift(){
  //   debugger
  //   const data = {
  //     "userId": localStorage.getItem('userId'),
  //     "dateTime": this.overTimeForm.get('otStartDate').value
  //   }
  //   this._oS.GetEmployeeShift(data).subscribe((res)=>{
  //     this.shiftItems = res.data;
  //     console.log("dfdsfbds", this.shiftItems)
  //   })
  //   this.addCustomValidator();
  // }
  // calculateTotaltime(i){

  //   var otCheckOut;
  //   var otCheckIn;
  //   if( i != -1 ){
  //     const day = this.overTimeDaysDtos.controls[i];
  //     otCheckOut = day.get('otCheckOut').value;
  //     otCheckIn = day.get('otCheckIn').value;
  //   }
  //   else{
  //     otCheckOut = this.overTimeForm.get('otCheckOut').value;
  //     otCheckIn = this.overTimeForm.get('otCheckIn').value;
  //   }
  //   const end = new Date("1970-01-01T" + otCheckOut);
  //   const start = new Date("1970-01-01T" + otCheckIn);

  //   const differenceInMillis = end.getTime() - start.getTime();

  //   const hours = Math.floor(differenceInMillis / (1000 * 60 * 60));
  //   const minutes = Math.floor((differenceInMillis % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((differenceInMillis % (1000 * 60)) / 1000);

  //   const formattedDifference = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  //   if(i == -1){
  //     this.overTimeForm.get('overTimeHours').setValue(formattedDifference);
  //   }
  //   else{
  //     this.overTimeDaysDtos.controls[i].get('overTimeHours').setValue(formattedDifference);
  //   }
  //   return formattedDifference;
  // }
  // padZero(num: number) {
  //   return num < 10 ? '0' + num : num.toString();
  // }

  // get sF() {
  //   return this.overTimeForm.controls;
  // }
  // get overTimeDaysDtos(): FormArray {
  //   return this.overTimeForm.get('overTimeDaysDtos') as FormArray;
  // }
  // overTimeDaysDtosForm(i: number): FormArray {
  //   const arr = this.overTimeForm.get('overTimeDaysDtos') as FormArray;
  //   const control = arr.at(i) as FormArray;
  //   return control;
  // }

  // createDayFormGroup(day: string): FormGroup {
  //   return this.fb.group({
  //     dayName: [day],
  //     otCheckIn: "00:00:00",
  //     otCheckOut: "00:00:00",
  //     overTimeHours: "00:00:00",
  //     otCheckInLoc: "",
  //     otCheckOutLoc: "",
  //     isWeekend: false
  //   });
  // }
  // initializeForm() {
  //   this.overTimeForm.reset({
  //     overTimeId: 0,
  //     userId: [this.userId],
  //     scheduleId: 0,
  //     date: this.today.toISOString(),
  //     type: 2,
  //     otStartDate: '',
  //     otEndDate: '',
  //     otCheckIn: "00:00:00",
  //     otCheckOut: "00:00:00",
  //     otCheckInLoc: "",
  //     otCheckOutLoc: "",
  //     isWeekend: false,
  //     notes: '',
  //     overTimeHours: "00:00:00",
  //     overTimeDaysDtos: []
  //   });

  //   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  //   const overTimeDaysDtos = this.overTimeForm.get('overTimeDaysDtos') as FormArray;
  //   overTimeDaysDtos.clear();
  //   days.forEach(day => {
  //     overTimeDaysDtos.push(this.createDayFormGroup(day));
  //   });
  //   console.log("form init", this.overTimeForm);

  // }
  // getLocations() {
  //   this._dropdownS.getLocationsforDDD().subscribe((res) => {
  //     this.locations = res.data;
  //   })
  // }

  // addCustomValidator() {
  //   const checkOutDateTime = this.overTimeForm.get('otCheckIn').value;
  //   if (checkOutDateTime !== null) {
  //     this.overTimeForm.setValidators(
  //       CustomValidators.overtimeValidator(this.shiftItems[0].shiftOut)
  //     );
  //     this.overTimeForm.updateValueAndValidity();
  //   }
  // }
  // get isCheckoutGreater(): boolean {
  //   return (
  //     this.overTimeForm.getError('invalidDate') &&
  //     this.overTimeForm.get('otCheckIn').touched
  //   );
  // }

  getCurrentMonthDateFormatted() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const parsedstartDate = new Date(startOfMonth);
    const parsedendDate = new Date(endOfMonth);
    this.startDate = this.datePipe.transform(parsedstartDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(parsedendDate, 'yyyy-MM-dd');
  }

  calculateDateRange() {
    const currentDate = moment();
    const startOfMonth = currentDate.clone().startOf('month').format('D MMM');
    const endOfMonth = currentDate.clone().endOf('month').format('D MMM');
    this.dateRange = `${startOfMonth} - ${endOfMonth}`;
  }
  getOvertime() {
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
    this._oS.getAllOvertime(data).subscribe((res) => {
      this.overtTimeItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.totalMonthsHours = res.totalApprovedHours + res.totalPendingHours + res.totalRejectedHours;
      this.approved = res.totalApprovedHours;
      this.pending = res.totalPendingHours;
      this.rejected = res.totalRejectedHours;
      this.totalOvertime = res.totalPlannedHours
      this.plannedOvertime = res.totalAvailedHours;
      this.remainingOvertime = res.totalPlannedHours - res.totalAvailedHours;
      this.overtTimeItems.forEach(element => {
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
          element.type = 'Planned';
        }
        if (element.type === 2) {
          element.type = 'Un-Planned';
        }

        element.overTimeDate = this.datePipe.transform(element.overTimeDate, 'MMM dd, yyyy');

      });


    })

  }
  // get oF() {
  //   return this.overTimeForm.controls
  // }
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
      this.getOvertime();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getOvertime();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getOvertime();
    }
  }


  generalFilter() {

    console.log("generalFilter", this.searchText)
    this.getOvertime();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {

      console.log("filterByDate", this.startDate, this.endDate)
      this.getOvertime();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  get leaveStatusKeys() {
    const keys = Object.keys(this.Statuss);

    return keys
  }
  filterByStatus(key: any) {

    this.overTimeStatus = Number(this.Statuss[key]);
    this.selectedOverTimeStatus = key;

    this.getOvertime();
  }

  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.searchText = "";
    this.getCurrentMonthDateFormatted();
    this.selectedOverTimeStatus = "Status";
    this.overTimeStatus = 0;
    this.sortBy = "";
    this.getOvertime();
  }
  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getOvertime();
  }
  adjustColumns() {

  }
  // getOvertimeDetails() {
  //   this._oS.getOvertimeById(this.currentId).subscribe((res) => {

  //     const parsedStartDate = new Date(res.leaveStartDate);
  //     res.leaveStartDate = this.datePipe.transform(parsedStartDate, 'yyyy-MM-dd');
  //     const parsedEndDate = new Date(res.leaveEndDate);
  //     res.leaveEndDate = this.datePipe.transform(parsedEndDate, 'yyyy-MM-dd');
  //     this.overTimeForm.patchValue(res)
  //   })
  // }
  getOvertimeSummary(requester,content) {
    this.openEnd(content)
    this._oS.getOvertimeRequestSummary(requester.overTimeId).subscribe(res => {
      this.requesterDetails = {
        "hours": this._dDFS.secondsToHHMM(res.data.hours),
        "notes": res.data.notes,
        "requester": res.data.requester,
        "appliedDate": moment(res.data.appliedDate).format("MMM D, YYYY h:mm A"),
      }
      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =  this.datePipe.transform(stage.createdDate,'MMM dd, yyyy');

        }
        else {
          stage.modifiedDate =  this.datePipe.transform(stage.modifiedDate,'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
      console.log("requestStages", this.requestStages)

    })

  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  // resetForm(content){
  //   this.openEnd(content)
  //   this.overTimeForm.reset();
  //   this.initializeForm()
  // }

  // submitForm(content) {
  //   debugger
  //   if (this.overTimeForm.valid) {
  //     this.overTimeForm.get('otEndDate').setValue(this.overTimeForm.get('otStartDate').value);
  //     this.isButtonDisabled = true;
  //     this.setOverTimeHours();
  //     this._oS.createOvertime(this.overTimeForm.value).subscribe((res) => {
  //       console.log(res)
  //       this.isButtonDisabled = false;
  //       if (res.statusCode === 200) {
  //         this.closeOffset(content)
  //         const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Overtime Added Successfully!" }
  //         this._toastS.updateToastData(toasterObject)
  //         this.getOvertime();
  //         this._toastS.hide();
  //       }
  //       if (res.statusCode === 400) {
  //         this.closeOffset(content)
  //         const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: res.message }
  //         this._toastS.updateToastData(toasterObject)
  //         this._toastS.hide();
  //       }

  //     }, (error: any) => {
  //       console.error("Internal Server Error", error);
  //       this.closeOffset(content)
  //       const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
  //       this._toastS.updateToastData(toasterObject)
  //       this._toastS.hide();
  //     })
  //   }

  //   else {
  //     this.markFormGroupTouched(this.overTimeForm);
  //   }

  // }
  // setOverTimeHours(){
  //   var arr = this.overTimeForm.get('overTimeDaysDtos') as FormArray;
  //   arr.value.forEach((val)=>{
  //     if(val.overTimeHours == "NaN:NaN:NaN")
  //     val.overTimeHours = "00:00:00";
  //   })
  // }
  // editOvertime(id: any,content) {
  //   this.openEnd(content)
  //   this.currentId = id;
  //   this.getOvertimeDetails();
  // }
  // deleteOvertime(id: any) {

  //   this._oS.deleteOvertime(id).subscribe((res) => {
  //     if (res.statusCode === 200) {

  //       this.getOvertime();
  //       const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Overtime Deleted Successfully!" }
  //       this._toastS.updateToastData(toasterObject)
  //       this._toastS.hide();

  //     }
  //   }, (error: any) => {
  //     console.error("Internal Server Error", error);
  //     const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
  //     this._toastS.updateToastData(toasterObject)
  //     this._toastS.hide();
  //   })
  // }

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

}

