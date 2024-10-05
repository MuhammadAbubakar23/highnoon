import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { SchedularService } from '../../services/schedular.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomValidators } from 'src/app/validators/custom.validators';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedular-team',
  templateUrl: './schedular-team.component.html',
  styleUrls: ['./schedular-team.component.css']
})
export class SchedularTeamComponent implements OnInit {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  searchText = "";
  startDate = "";
  endDate = "";
  sortBy = "";
  currentId = 0;
  employees: any = [];
  schedularItems: any = [];
  summaryToggle: boolean = false;
  desColumns = ['scheduleDate', 'userName', 'shiftStart', 'shiftEnd', 'breakStart', 'breakEnd', 'overTimeHours', 'status'];
  columnNames = ['Date', 'Name', 'Check-In', 'Check-Out', 'Break Start', 'Break End', 'Overtime', 'Status'];
  sortingColumns =["UserName","DateTime","CheckIn","CheckOut","Status"]
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  requesterDetails: any = {};
  summaryItem: any = {};
  requestStages: any = [];
  currentRequestStageId = 0;
  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
        Validators.maxLength(200)])
    }
  )
  scheduleForm = this.fb.group({
    userId: [null, Validators.required],
    dateStart: ['', Validators.required],
    dateEnd: ['', Validators.required],
    shiftStart: ['', Validators.required],
    shiftEnd: ['', Validators.required],
    breakStart: ['', Validators.required],
    breakEnd: ['', Validators.required],
    overTimeHours: ["00:00", Validators.required],
    notes: ['', Validators.required],
    scheduleDays: this.fb.array([])
  }, { validator: CustomValidators.breakTimeWithinShift() })

  get isbreakTimeWithinShift(): boolean {
    return (
      this.scheduleForm.hasError('breakTimeInvalid') &&
      (this.scheduleForm.get('breakStart').touched || this.scheduleForm.get('breakEnd').touched)
    );
  }

  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
      this.offcanvasService.open(content, { position: 'end' });
    }
   closeOffset(content: TemplateRef<any>) {
      this.offcanvasService.dismiss(content);
    }
  constructor(private _hS: HeaderService, private _scheduleS: SchedularService, private fb: FormBuilder, private _ddS: DropDownApiService, private _toastS: ToasterService, private _r: Router
    , private _dDFS: DateTimeFormatService, private spinner: NgxSpinnerService, private datePipe: DatePipe, private _per: MenuPermissionService, private _route: Router) {
    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Schedular')) {
      tabs.push({ title: 'My Roster', url: 'connect/attendance/roster', isActive: false }, { title: 'My Requests', url: 'connect/attendance/roster/my-requests', isActive: false })
    }
    // if (this._per.hasPermission('Team Requests Schedular')) {
    //   tabs.push({ title: 'Team Requests', url: 'connect/attendance/schedular/team-requests', isActive: true })
    // }
    if (this._per.hasPermission('Team Schedular')) {
      tabs.push({ title: 'Team Roster', url: 'connect/attendance/team-roster', isActive: false }, { title: 'Team Requests', url: 'connect/attendance/roster/team-requests', isActive: true })
    }
    else {
      this._route.navigateByUrl('/connect/attendance/roster');
    }
    this._hS.updateHeaderData({
      title: 'Roster',
      tabs: tabs,
      isTab: isTabActive,
    })

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      this.scheduleDays.push(this.createDayFormGroup(day));
    });
  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getTeamSchedular();
    this._scheduleS.getTeamList(Number(localStorage.getItem('userId'))).subscribe((res) => {
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

  filterByDate() {
    if (this.endDate >= this.startDate) {

      console.log("filterByDate", this.startDate, this.endDate)
      this.getTeamSchedular();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.searchText = "";
    this.getCurrentMonthDateFormatted();
    this.sortBy = "";
    this.getTeamSchedular();
  }

sortDataBy(columnName) {
  this.sortBy = columnName;
  this.getTeamSchedular();
}
  getTeamSchedular() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.searchText,
      startDate: this.startDate,
      endDate: this.endDate,
      sortBy: this.sortBy
    }
    console.log("data", data)
    this.spinner.show();

    this._scheduleS.getTeamRequest(data).subscribe((res) => {

      this.spinner.hide();
      this.pending = res.pending;
      this.approved = res.approved;
      this.rejected = res.rejected;
      this.totalRequest = this.pending + this.approved + this.rejected;
      this.schedularItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      // this.updateScheduleItems();
      this.schedularItems.forEach((item)=>{
        if(item.scheduleDate){
          item.scheduleDate=this.datePipe.transform(item.scheduleDate,"yyyy-MM-dd")
        }
      })
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
      this.getTeamSchedular();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeamSchedular();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getTeamSchedular();
    }
  }



  createDayFormGroup(day: string): FormGroup {
    return this.fb.group({
      dayName: [day],
      shiftStart: [null],
      shiftEnd: [null],
      breakStart: [null],
      breakEnd: [null],
      overTimeHours: [null],
    });
  }
  get scheduleDays(): FormArray {
    return this.scheduleForm.get('scheduleDays') as FormArray;
  }

  editTeamSchedular(id: any,content) {
    this.openEnd(content)
    this.currentId = id;
    this.getTeamSchedular();
  }
  deleteTeamSchedular(id: any) {

    this._scheduleS.deleteSchedular(id).subscribe((res) => {
      if (res.statusCode === 200) {
        const schedular = this.schedularItems.filter((item: any) => item.leaveId !== id);
        const toasterObject = { isShown: true, toastHeading: "Deleted", toastParagrahp: "Roster Deleted Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
        this.schedularItems = schedular;
      }
    },
      (error: any) => {
        console.error("Login error:", error);
      });
  }
  updateRequestStageId(id: number) {
    this.currentRequestStageId = id;
    this.teamRequestForm.reset();
  }
  getTeamSummary(requester: any,content) {
    this.openEnd(content);
    this.teamRequestForm.reset();
    this.currentRequestStageId = requester.requestStage.requestStageId;
    this.summaryItem = requester;
    this._scheduleS.getScheduleRequestSummary(requester.scheduleRequestId).subscribe(res => {

      const shiftStart = res.data.shiftStart
      const shiftEnd = res.data.shiftEnd
      const breakStart =res.data.breakStart
      const breakEnd = res.data.breakEnd
      const currentShiftStart = res.data.currentShiftStart
      const currentShiftEnd = res.data.currentShiftEnd
      const currentBreakStart = res.data.currentBreakStart
      const currentBreakEnd = res.data.breakEnd
      const shiftHours = this._dDFS.findTimeDifference(shiftStart, shiftEnd)
      const breakHours = this._dDFS.findTimeDifference(breakStart, breakEnd)
      const currentShiftHours = this._dDFS.findTimeDifference(currentShiftStart, currentShiftEnd)
      const currentBreakHours = this._dDFS.findTimeDifference(currentBreakStart, currentBreakEnd)
      this.requesterDetails = {
        "requester": res.data.requester,
        "shiftStart": res.data.shiftStart,
        "shiftHours": shiftHours,
        "shiftEnd": res.data.shiftEnd,
        "breakStart": res.data.breakStart,
        "breakHours": breakHours,
        "breakEnd": res.data.breakEnd,
        "overTimeHours": res.data.overTimeHours,
        "currentShiftStart": res.data.currentShiftStart,
        "currentShiftHours": currentShiftHours,
        "currentShiftEnd": res.data.currentShiftEnd,
        "currentBreakStart": res.data.currentBreakStart,
        "currentBreakHours": currentBreakHours,
        "currentBreakEnd": res.data.currentBreakEnd,
        "currentOverTimeHours":res.data.currentOverTimeHours,
        "notes": res.data.notes,
        "appliedDate": moment(res.data.appliedDate).format("MMM D, YYYY h:mm A"),
      };
      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =  this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate =   this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
      console.log("requestStages", this.requestStages)
    })

  }
  resetForm(content) {
    this.openEnd(content)
    this.scheduleForm.reset({
      userId: null,
      dateStart: '',
      dateEnd: '',
      shiftStart: '',
      shiftEnd: '',
      breakStart: '',
      breakEnd: '',
      overTimeHours: "00:00",
      notes: '',
      scheduleDays: []
    });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const scheduleDaysArray = this.scheduleForm.get('scheduleDays') as FormArray;
    scheduleDaysArray.clear();
    days.forEach(day => {
      scheduleDaysArray.push(this.createDayFormGroup(day));
    });
  }
  updateScheduleForm() {
    const fieldsToUpdate = ['shiftStart', 'shiftEnd', 'breakStart', 'breakEnd', 'overTimeHours'];
    fieldsToUpdate.forEach(fieldName => {
      const fieldValue = this.scheduleForm.get(fieldName)?.value;
      if (fieldValue !== null && fieldValue !== '') {
        this.scheduleForm.patchValue({
          [fieldName]: fieldValue + ':00'
        });
      }
      else {
        this.scheduleForm.patchValue({
          [fieldName]: "00:00:00"
        });
      }
    });
    const scheduleDaysArray = this.scheduleForm.get('scheduleDays') as FormArray;
    scheduleDaysArray.controls.forEach((dayGroup: FormGroup) => {
      fieldsToUpdate.forEach(fieldName => {
        const fieldValue = dayGroup.get(fieldName)?.value;
        if (fieldValue !== null && fieldValue !== '') {
          dayGroup.patchValue({
            [fieldName]: fieldValue + ':00'
          });
        }
        else {
          dayGroup.patchValue({
            [fieldName]: "00:00:00"
          });
        }
      });
    });

  }
  checkTime() {

    console.log("Checking", this.scheduleForm.value)
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  // submitForm() {
  //   if (this.scheduleForm.valid) {
  //     this.updateScheduleForm();
  //     const data = this.scheduleForm.value;
  //     this._scheduleS.createTeamSchedular(data).subscribe(
  //       (res) => {
  //         console.log(res);
  //         if (res.statusCode === 200) {
  //           this.showOffcanvas = false;
  //           const toasterObject = {
  //             isShown: true,
  //             isSuccess: true,
  //             toastHeading: "Success",
  //             toastParagrahp: "Scheduler Added Successfully!"
  //           };
  //           this._toastS.updateToastData(toasterObject);
  //           this._r.navigate(['/connect/attendance/schedular/team']);
  //           this.getTeamSchedular();
  //           this._toastS.hide();
  //         } else if (res.statusCode === 400) {
  //           this.showOffcanvas = false;
  //           const toasterObject = {
  //             isShown: true,
  //             isSuccess: false,
  //             toastHeading: "Failed",
  //             toastParagrahp: res.message
  //           };
  //           this._toastS.updateToastData(toasterObject);
  //           this._r.navigate(['/connect/attendance/schedular/team']);
  //           this.getTeamSchedular();
  //           this._toastS.hide();
  //         } else {
  //           this.showOffcanvas = false;
  //           const toasterObject = {
  //             isShown: true,
  //             isSuccess: false,
  //             toastHeading: "Failed",
  //             toastParagrahp: res.message
  //           };
  //           this._toastS.updateToastData(toasterObject);
  //           this._r.navigate(['/connect/attendance/schedular/team']);
  //           this.getTeamSchedular();
  //           this._toastS.hide();
  //         }
  //       },
  //       (error: any) => {
  //         console.error("Internal Server Error", error);
  //         this.showOffcanvas = false;
  //         const toasterObject = {
  //           isShown: true,
  //           isSuccess: false,
  //           toastHeading: "Failed",
  //           toastParagrahp: "Internal Server Error!"
  //         };
  //         this._toastS.updateToastData(toasterObject);
  //         this._toastS.hide();
  //       }
  //     );
  //   }
  //   else {
  //     this.markFormGroupTouched(this.scheduleForm);
  //   }
  // }
  get rF() {
    return this.teamRequestForm.controls;
  }
  updateRequest(reqstageId: number, statusId: number,content) {

    this.summaryToggle = false;
    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._scheduleS.updateRequestStage(data).subscribe((res) => {
      this.closeOffset(content)
      if (res.statusCode === 200) {
        let message = ""
        if (statusId === 2) {
          message = "You have approved the Request successfully."
        }
        if (statusId === 3) {
          message = "You have rejected the Request."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getTeamSchedular();
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
  get sF() {
    return this.scheduleForm.controls;
  }
  exportData() {

    const obj = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.searchText,
      startDate: this.startDate,
      endDate: this.endDate,
      sortBy: this.sortBy
    }
    this._scheduleS.getTeamScheduleReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'TeamRosterDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }

}
