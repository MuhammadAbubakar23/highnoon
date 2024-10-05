import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { SchedularService } from '../../../services/schedular.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { CustomValidators } from 'src/app/validators/custom.validators';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from 'src/app/main/console/services/shift.service';

@Component({
  selector: 'app-team-schedular',
  templateUrl: './team-schedular.component.html',
  styleUrls: ['./team-schedular.component.css']
})
export class TeamSchedularComponent implements OnInit {
  today = new Date;
  shiftStart = "2024-04-06"
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  searchText = "";
  isMultiple: boolean = true;
  startDate = "";
  endDate = "";
  shiftItems: any = [];
  sortBy = "";
  currentId = 0;
  locations: any;
  isButtonDisabled = false;
  employees: any = [];
  schedularItems: any = [];
  desColumns = ['date', 'userName', 'shiftStart', 'shiftEnd', 'breakStart', 'breakEnd'];
  columnNames = ['Date', 'User Name', 'Check-In', 'Check-Out', 'Break-In', 'Break-Out'];

  sortingColumns = ["DateTime", "UserName", "CheckIn", "BreakStart", "CheckOut", "BreakEnd",]
  total = 0;
  regular = "";
  overtime: any = "";
  scheduleForm = this.fb.group({
    userId: [0, Validators.required],
    shiftId: [null, Validators.required],
    scheduleId: 0,
    date: [this.today],
    dateStart: [null, Validators.required],
    dateEnd: [null],
    isWeekend: [false],
    generalShift: false,
    location: [null, Validators.required],
    notes: ['', Validators.required],
    // scheduleDays: this.fb.array([])
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

  get isDateGreater(): boolean {
    const dateStart = this.scheduleForm.get('dateStart').value;
    const dateEnd = this.scheduleForm.get('dateEnd').value;
    return (dateEnd !== null && dateStart !== null && dateEnd <= dateStart);
  }
  constructor(private _hS: HeaderService, private _scheduleS: SchedularService, private _dTFS: DateTimeFormatService, private fb: FormBuilder, private _ddS: DropDownApiService, private _toastS: ToasterService, private _r: Router
    , private _dDFS: DateTimeFormatService, private spinner: NgxSpinnerService, private datePipe: DatePipe, private _per: MenuPermissionService, private shift: ShiftService, private _dropdownS: DropDownApiService
  ) {
    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Schedular')) {
      tabs.push({ title: 'My Roster', url: 'connect/attendance/roster', isActive: false })
    }
    // if (this._per.hasPermission('My Schedular')) {
    //   tabs.push({ title: 'My Roster', url: 'connect/attendance/roster', isActive: false }, { title: 'My Requests', url: 'connect/attendance/roster/my-requests', isActive: false })
    // }
    if (this._per.hasPermission('Team Schedular')) {
      tabs.push({ title: 'Team Roster', url: 'connect/attendance/team-roster', isActive: true })
    }
    // if (this._per.hasPermission('Team Schedular')) {
    //   tabs.push({ title: 'Team Roster', url: 'connect/attendance/team-roster', isActive: true }, { title: 'Team Requests', url: 'connect/attendance/roster/team-requests', isActive: false })
    // }

    this._hS.updateHeaderData({
      title: 'Roster',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getShift();
    this.getSchedular();
    this.getLocations();
    this._scheduleS.getTeamList(Number(localStorage.getItem('userId'))).subscribe((res) => {
      this.employees = res.data;
    })
  }
  addCustomValidator2() {
    this.scheduleForm.get('dateStart')
    const dateStart = this.scheduleForm.get('dateStart').value;
    const dateEnd = this.scheduleForm.get('dateEnd').value;


    if (dateStart != null && dateEnd != null) {
      this.scheduleForm.setValidators(
        CustomValidators.overtimeValidator2(dateStart, dateEnd)
      );
      this.scheduleForm.updateValueAndValidity();
    }
  }

  isDurationOk2(): boolean {
    return (this.scheduleForm.getError('invalidDuration2')
      && this.scheduleForm.get('dateEnd').touched)
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

    this._scheduleS.getTeamSchedule(data).subscribe((res) => {

      console.log("Schedular", res.data);
      this.schedularItems = res.pagedReponse?.data;
      this.schedularItems?.forEach((item) => {
        if (item.date) {
          item.date = this.datePipe.transform(item.date, "yyyy-MM-dd")
        }
      })
      this.totalPages = res.pagedReponse?.totalPages;
      this.totalRecords = res.pagedReponse?.totalRecords;
      this.regular = res.totalRegularHours;
      this.overtime = this._dDFS.secondsToHHMM(res.totalOverTimeHours);
      this.overtime = moment(this.overtime, 'HH:mm A').hours();
      this.total = Number(this.regular) + this.overtime;
      this.overtime = this.overtime + " " + "Hours";
      // this.updateScheduleItems();
      this.spinner.hide();
    })
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
  getLocations() {
    this._dropdownS.getLocationsforDDD().subscribe((res) => {
      this.locations = res.data;
    })
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.searchText = "";
    this.getCurrentMonthDateFormatted();
    this.sortBy = "";
    this.getSchedular();
  }

  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getSchedular();
  }
  updateScheduleItems() {
    this.schedularItems.forEach(element => {
      element.date =   this.datePipe.transform(element.date, 'MMM dd, yyyy');
      element.shiftStart = moment(element.shiftStart).format("h:mm A");
      element.shiftEnd = moment(element.shiftEnd).format("h:mm A");
      const bStart = moment(element.breakStart).format("h:mm A");
      const bEnd = moment(element.breakEnd).format("h:mm A");
      const { hours } = this._dDFS.calculateHourDifference(bStart, bEnd);
      element.breakINOut = hours + " " + "Hour" + " " + bStart + " - " + bEnd;
      element.totalOverTime = this._dDFS.secondsToHHMM(element.totalOverTime) + " " + "Hours";;
      element.totalHours = this._dDFS.convertToHours(element.totalHours);
    });
    console.log("listing element", this.schedularItems);
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

  get sF() {
    return this.scheduleForm.controls;
  }
  // get scheduleDays(): FormArray {
  //   return this.scheduleForm.get('scheduleDays') as FormArray;
  // }
  createDayFormGroup(day: string): FormGroup {
    return this.fb.group({
      dayName: [day],
      shiftId: null,
      isWeekend: false,
      generalShift: false
    });
  }
  resetForm(content) {
    this.openEnd(content)
    this.scheduleForm.reset({
      userId: null,
      shiftId: null,
      dateStart: null,
      dateEnd: null,
      notes: '',
      location: null,
      // scheduleDays: []
    });
    // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // const scheduleDaysArray = this.scheduleForm.get('scheduleDays') as FormArray;
    // scheduleDaysArray.clear();
    // days.forEach(day => {
    //   scheduleDaysArray.push(this.createDayFormGroup(day));
    // });

  }

  getShift() {
    this.shift.getShiftForDD().subscribe((res) => {
      this.shiftItems = res.data;
    })
  }
  // setShiftTimings(id){
  //   debugger
  //   this.scheduleForm.get('shiftId').setValue = id;
  //   const shift = this.shiftItems.find(shift => shift.shiftIdId = id)
  //   this.scheduleForm.get('shiftStart').setValue = shift.checkIn;
  //   this.scheduleForm.get('checkOut').setValue = shift.checkOut;
  //   this.scheduleForm.get('breakIn').setValue = shift.breakIn;
  //   this.scheduleForm.get('breakOut').setValue = shift.breakOut;
  // }
  getShiftProperty(property: string): string {

    const selectedShiftId = this.scheduleForm.get('shiftId').value;
    const selectedShift = this.shiftItems.find(shift => shift.shiftIdId === selectedShiftId);
    return selectedShift ? selectedShift[property] : '';
  }
  // getShiftPropertyArray(property: string, index): string{

  //   const day = this.scheduleDays.controls[index];
  //   const selectedShiftId = day.get('shiftId').value;
  //   const selectedShift = this.shiftItems.find(shift => shift.shiftIdId === selectedShiftId);
  //   return selectedShift ? selectedShift[property] : '';
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
  //     else {
  //       this.scheduleForm.patchValue({
  //         [fieldName]: "00:00:00"
  //       });
  //     }
  //   });
  //   const scheduleDaysArray = this.scheduleForm.get('scheduleDays') as FormArray;
  //   scheduleDaysArray.controls.forEach((dayGroup: FormGroup) => {
  //     fieldsToUpdate.forEach(fieldName => {
  //       const fieldValue = dayGroup.get(fieldName)?.value;
  //       if (fieldValue !== null && fieldValue !== '') {
  //         dayGroup.patchValue({
  //           [fieldName]: fieldValue + ':00'
  //         });
  //       }
  //       else {
  //         dayGroup.patchValue({
  //           [fieldName]: "00:00:00"
  //         });
  //       }
  //     });
  //   });

  // }

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
    if (this.scheduleForm.valid) {
      if (this.scheduleForm.value.scheduleId != null && this.scheduleForm.value.scheduleId != 0) {
        this.isButtonDisabled = true;
        // const scheduleDaysArray = this.scheduleForm.get('scheduleDays') as FormArray;
        // scheduleDaysArray.clear();
        // this.updateScheduleForm();
        const data = this.scheduleForm.value;
        this._scheduleS.updateSchedularByManager(data).subscribe((res) => {
          this.isButtonDisabled = false;
          console.log(res)
          if (res.statusCode === 200) {
            this.closeOffset(content)
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Success", toastParagrahp: "Change request applied successfully." }
            this._toastS.updateToastData(toasterObject)
            this.getSchedular();
            this._r.navigate(['/connect/attendance/roster/team-roster']);
            this._toastS.hide();
          }
          if (res.statusCode === 400) {
            this.closeOffset(content)
            const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: res.message }
            this._toastS.updateToastData(toasterObject)
            this._r.navigate(['/connect/attendance/roster/team-roster']);
            this.getSchedular();
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

        // this.updateScheduleForm();
        this.scheduleForm.get('date').setValue(new Date().toISOString());
        this.scheduleForm.get('scheduleId').setValue(0);
        if (this.scheduleForm.get('isWeekend').value == null) {
          this.scheduleForm.get('isWeekend').setValue(false);
        }
        var dateeStart = new Date(this.scheduleForm.value.dateStart);
        var dateeEnd = new Date(this.scheduleForm.value.dateEnd);
        this.scheduleForm.get('dateStart').setValue(dateeStart.toISOString());
        if (this.scheduleForm.get('dateEnd').value != null) {
          this.scheduleForm.get('dateEnd').setValue(dateeEnd.toISOString());
        }
        const data = this.scheduleForm.value;
        this._scheduleS.createTeamSchedular(data).subscribe(
          (res) => {
            console.log(res);
            if (res.statusCode === 200) {
              this.closeOffset(content)
              const toasterObject = {
                isShown: true,
                isSuccess: true,
                toastHeading: "Success",
                toastParagrahp: "Scheduler Added Successfully!"
              };
              this._toastS.updateToastData(toasterObject);
              this._r.navigate(['/connect/attendance/roster/team']);
              this.getSchedular();
              this._toastS.hide();
            } else if (res.statusCode === 400) {
              this.closeOffset(content)
              const toasterObject = {
                isShown: true,
                isSuccess: false,
                toastHeading: "Failed",
                toastParagrahp: res.message
              };
              this._toastS.updateToastData(toasterObject);
              this._r.navigate(['/connect/attendance/roster/team']);
              this.getSchedular();
              this._toastS.hide();
            } else {
              this.closeOffset(content);
              const toasterObject = {
                isShown: true,
                isSuccess: false,
                toastHeading: "Failed",
                toastParagrahp: res.message
              };
              this._toastS.updateToastData(toasterObject);
              this._r.navigate(['/connect/attendance/roster/team']);
              this.getSchedular();
              this._toastS.hide();
            }
          },
          (error: any) => {
            console.error("Internal Server Error", error);
            this.closeOffset(content)
            const toasterObject = {
              isShown: true,
              isSuccess: false,
              toastHeading: "Failed",
              toastParagrahp: "Internal Server Error!"
            };
            this._toastS.updateToastData(toasterObject);
            this._toastS.hide();
          }
        );

      }
    }

    else {
      this.markFormGroupTouched(this.scheduleForm);
    }


  }
  toggleDateEndReadonly(isReadonly: boolean) {
    const dateStartControl = this.scheduleForm.get('dateEnd');
    if (isReadonly) {
      dateStartControl.setValue(null);
      this.addCustomValidator2();
      dateStartControl.disable();
    } else {
      dateStartControl.enable();
    }
  }
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
  editSchedular(id, content) {
    this.openEnd(content);
    this._scheduleS.getSchedularById(id, 0).subscribe((res: any) => {
      debugger
      res.data.scheduleDate = res.data.scheduleDate.split('T')[0];
      this.scheduleForm.patchValue({
        'userId': res.data.userId,
        'shiftId': res.data.shiftId,
        'scheduleId': res.data.scheduleId,
        'generalShift': res.data.generalShift,
        'dateStart': res.data.scheduleDate,
        'dateEnd': res.data.scheduleDate,
        'date': res.data.scheduleDate,
        'location': res.data.location,
        'notes': res.data.notes,
      });
      // this.scheduleForm.get('dateStart').setValue('2023-12-07');
      // this.scheduleForm.get('dateEnd').setValue('2023-12-07');
      // const newFormGroup = this.fb.group({
      //   dayName: [''],
      // });
      // this.scheduleDays.push(newFormGroup);
      // console.log("form", this.scheduleForm);
    })
  }
}
