import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { SchedularService } from '../../services/schedular.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from 'src/app/main/console/services/shift.service';

@Component({
  selector: 'app-schedular',
  templateUrl: './schedular.component.html',
  styleUrls: ['./schedular.component.css']
})
export class SchedularComponent implements OnInit {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  searchText = "";
  startDate = "";
  endDate = "";
  sortBy = "";
  currentId = 0;
  generalShiftStart;
  generalShiftEnd;
  isButtonDisabled = false;
  employees: any = [];
  shiftItems: any = [];
  schedularItems: any = [];
  desColumns = ['date', 'shiftStart', 'shiftEnd', 'breakStart', 'breakEnd'];
  columnNames = ['Date', 'Check-In', 'Check-Out', 'Break-In', 'Break-out',];

  sortingColumns = ["DateTime", "CheckIn", "BreakStart", "CheckOut", "BreakEnd"]
  total = 0;
  regular = "";
  overtime: any = "";
  // scheduleForm = this.fb.group({
  //   userId: [0],
  //   scheduleId: [0],
  //   shiftId: null,
  //   date: ['', Validators.required],
  //   dateStart: ['2023-12-07'],
  //   dateEnd: ['2023-12-07'],
  //   notes: ['', Validators.required],
  // })
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  constructor(private _hS: HeaderService, private _scheduleS: SchedularService, private _dTFS: DateTimeFormatService, private fb: FormBuilder, private _ddS: DropDownApiService, private _toastS: ToasterService, private _r: Router
    , private _dDFS: DateTimeFormatService, private spinner: NgxSpinnerService, private datePipe: DatePipe, private _per: MenuPermissionService, private shift: ShiftService
  ) {

    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Schedular')) {
      tabs.push({ title: 'My Roster', url: 'connect/attendance/roster', isActive: true })
    }
    // if (this._per.hasPermission('My Schedular')) {
    //   tabs.push({ title: 'My Roster', url: 'connect/attendance/roster', isActive: true }, { title: 'My Requests', url: 'connect/attendance/roster/my-requests', isActive: false })
    // }
    if (this._per.hasPermission('Team Schedular')) {
      tabs.push({ title: 'Team Roster', url: 'connect/attendance/team-roster', isActive: false })
    }
    // if (this._per.hasPermission('Team Schedular')) {
    //   tabs.push({ title: 'Team Roster', url: 'connect/attendance/team-roster', isActive: false }, { title: 'Team Requests', url: 'connect/attendance/roster/team-requests', isActive: false })
    // }

    this._hS.updateHeaderData({
      title: 'Roster',
      tabs: tabs,
      isTab: isTabActive,
    })

  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getSchedular();
    // this.getShift();
    this._ddS.getEmployeesForDD().subscribe((res) => {
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
  getSchedular() {
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

    this._scheduleS.getAllSchedular(data).subscribe((res) => {

      console.log("Schedular", res.data);
      this.generalShiftStart = res.generalShift.start;
      this.generalShiftEnd = res.generalShift.end;
      this.schedularItems = res.pagedReponse.data;
      this.schedularItems = this.schedularItems.filter(f => f.shiftStart != this.generalShiftStart && f.shiftEnd != this.generalShiftEnd)
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.regular = res.totalRegularHours;
      this.schedularItems.forEach((item) => {
        if (item.date) {
          item.date = this.datePipe.transform(item.date, "yyyy-MM-dd")
        }
      })
      // this.overtime = this._dDFS.secondsToHHMM(res.totalOverTimeHours);
      // this.overtime = moment(this.overtime, 'HH:mm A').hours();
      // this.total = Number(this.regular) + this.overtime;
      // this.overtime = this.overtime + " " + "Hours";
      // this.updateScheduleItems();
      this.spinner.hide();
    })
  }
  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getSchedular();
  }

  resetEndDate() {
    this.endDate = '';
  }
  filterByDate() {
    if (this.endDate >= this.startDate) {
      console.log("filterByDate", this.startDate, this.endDate)
      this.getSchedular();
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
    this.getSchedular();
  }
  // updateScheduleItems() {
  //   this.schedularItems.forEach(element => {
  //     element.date = moment(element.date).format('MMM DD, YYYY')
  //     element.shiftStart = moment(element.shiftStart).format("h:mm A");
  //     element.shiftEnd = moment(element.shiftEnd).format("h:mm A");
  //     const bStart = moment(element.breakStart).format("h:mm A");
  //     const bEnd = moment(element.breakEnd).format("h:mm A");
  //     const { hours } = this._dDFS.calculateHourDifference(bStart, bEnd);
  //     element.breakINOut = hours + " " + "Hour" + " " + bStart + " - " + bEnd;
  //     element.totalOverTime = this._dDFS.secondsToHHMM(element.totalOverTime) + " " + "Hours";;
  //     element.totalHours = this._dDFS.convertToHours(element.totalHours);
  //   });
  //   console.log("listing element", this.schedularItems);
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
      this.getSchedular();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getSchedular();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getSchedular();
    }
  }

  // get sF() {
  //   return this.scheduleForm.controls;
  // }
  // get scheduleDays(): FormArray {
  //   return this.scheduleForm.get('scheduleDays') as FormArray;
  // }

  // getSchuleByDate() {
  //   const data = {
  //     "date": this.scheduleForm.get('date').value
  //   }
  //   this.spinner.show()
  //   this._scheduleS.getScheduleByDate(data).subscribe((res) => {
  //     this.spinner.hide();
  //     console.log("get Scheule By Date", res.data);
  //     this.scheduleForm.patchValue({
  //       'userId': res.data.userId,
  //       'shiftId': res.data.shiftId,
  //       'scheduleId': res.data.scheduleId,
  //       'notes': res.data.notes,
  //     });

  //   })
  // }
  // resetForm(content) {
  //   this.openEnd(content)
  //   this.scheduleForm.reset({
  //     userId: 0,
  //     dateStart: '',
  //     dateEnd: '',
  //     notes: '',
  //   });
  // }


  // updateScheduleForm() {
  //   const fieldsToUpdate = ['shiftStart', 'shiftEnd', 'breakStart', 'breakEnd', 'overTimeHours'];
  //   fieldsToUpdate.forEach(fieldName => {
  //     const fieldValue = this.scheduleForm.get(fieldName)?.value;
  //     if (fieldValue !== null && fieldValue !== '') {
  //       this.scheduleForm.patchValue({
  //         [fieldName]: fieldValue + ':00'
  //       });
  //     }
  //   });
  // }


  // private markFormGroupTouched(formGroup: FormGroup) {
  //   Object.values(formGroup.controls).forEach(control => {
  //     control.markAsTouched();

  //     if (control instanceof FormGroup) {
  //       this.markFormGroupTouched(control);
  //     }
  //   });
  // }
  // submitForm(content) {
  //   if (this.scheduleForm.valid) {
  //     this.isButtonDisabled = true;
  //     // this.updateScheduleForm();
  //     const data = this.scheduleForm.value;
  //     this._scheduleS.updateSchedular(data).subscribe((res) => {
  //       this.isButtonDisabled = false;
  //       console.log(res)
  //       if (res.statusCode === 200) {
  //        this.closeOffset(content)
  //         const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Success", toastParagrahp: "Change request applied successfully." }
  //         this._toastS.updateToastData(toasterObject)
  //         this.getSchedular();
  //         this._r.navigate(['/connect/attendance/schedular/my-requests']);
  //         this._toastS.hide();
  //       }
  //       if (res.statusCode === 400) {
  //        this.closeOffset(content)
  //         const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: res.message }
  //         this._toastS.updateToastData(toasterObject)
  //         this._r.navigate(['/connect/attendance/schedular/my-requests']);
  //         this.getSchedular();
  //         this._toastS.hide();
  //       }

  //     }, (error: any) => {
  //      this.closeOffset(content)
  //       console.error("Internal Server Error", error);
  //       const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
  //       this._toastS.updateToastData(toasterObject)
  //       this._toastS.hide();
  //     })
  //   }

  //   else {
  //     this.markFormGroupTouched(this.scheduleForm);
  //   }


  // }
  // getShift(){
  //   this.shift.getShiftForDD().subscribe((res)=>{
  //     this.shiftItems = res.data;
  //   })
  // }
  // getShiftProperty(property: string): string {

  //   const selectedShiftId = this.scheduleForm.get('shiftId').value;
  //   const selectedShift = this.shiftItems.find(shift => shift.shiftIdId === selectedShiftId);
  //   return selectedShift ? selectedShift[property] : '';
  // }

  exportData() {

    const obj = {
      startDate: this.startDate,
      endDate: this.endDate,
      text: this.searchText,
      sortBy: this.sortBy
    }
    this._scheduleS.getScheduleReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'ScheduleDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}
