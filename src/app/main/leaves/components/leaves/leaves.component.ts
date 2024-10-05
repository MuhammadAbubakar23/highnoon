import { Component, Input, OnInit, Output, TemplateRef, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from 'src/app/services/header.service';
import { Leave } from '../../../../shared/models/statuss';
import { LeavesService } from '../../services/leaves.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status } from '../../../../shared/models/statuss';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import * as moment from 'moment';
import { CustomValidators } from 'src/app/validators/custom.validators';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {
  @Input() isTabs: boolean = true;
  leaveItems: any = [];
  // sortingColumns=["Date","Type","Duration", "Status"];
  desColumns = ['date', 'leavetype', 'leaveDuration', 'leaveStatus'];
  columnNames = ['Date', 'Type', '	Duration', 'Status'];
  sortingColumns = ["Date", "Type", "Duration", "Status"]
  newLeave = new Leave();
  leaveTypes: any[] = [];
  isButtonDisabled = false;
  leaveStatuss = Status;
  isCanvas: boolean = false;
  showOffcanvas: boolean = false;
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  text = "";
  startDate = "";
  endDate = "";
  currentDate = new Date();
  leaveType = 0;
  selectedLeaveType = "";
  leaveStatus = 0;
  selectedLeaveStatus = "";
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  leaveQuota: any = {};
  remainingleaves = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  applyLeaveForm = new FormGroup({
    leaveId: new FormControl(this.newLeave.leaveId),
    userId: new FormControl(this.newLeave.userId),
    //year: new FormControl(this.newLeave.year),
    leaveStartDate: new FormControl(this.newLeave.leaveStartDate, [Validators.required]),
    leaveEndDate: new FormControl(this.newLeave.leaveEndDate, [Validators.required]),
    leaveTypeId: new FormControl(this.newLeave.leaveTypeId, [Validators.required]),
    leaveStatusId: new FormControl(this.newLeave.leaveStatusId),
    reason: new FormControl(this.newLeave.reason, [Validators.required, Validators.maxLength(200)])
  })
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  addCustomValidator() {
    const leaveEndDate = this.applyLeaveForm.get('leaveEndDate').value;
    if (leaveEndDate !== null) {
      this.applyLeaveForm.setValidators(
        CustomValidators.dateValidatorForLeave('leaveStartDate', 'leaveEndDate')
      );
      this.applyLeaveForm.updateValueAndValidity();
    }
  }
  get isDateGreater(): boolean {
    return (
      this.applyLeaveForm.getError('invalidDate') &&
      this.applyLeaveForm.get('leaveEndDate').touched
    );
  }
  constructor(private _hS: HeaderService, private _lS: LeavesService, private _toastS: ToasterService, private _dropdownS: DropDownApiService, private datePipe: DatePipe,
    private spinner: NgxSpinnerService, private _per: MenuPermissionService) {

  }


  ngOnInit(): void {
    //const hasCheckedPermissions = this._per.hasPermission(permissionsToCheck)
    //console.log("hasCheckedPermissions", hasCheckedPermissions)

    //My Leaves
    // Team Leaves
    if (this.isTabs === true) {
      let tabs = [];
      let isTabActive = true;
      if (this._per.hasPermission('My Leaves')) {
        tabs.push({ title: 'My Leaves', url: 'connect/leaves', isActive: true })
      }
      if (this._per.hasPermission('Team Leaves')) {
        tabs.push({ title: 'Team Requests', url: 'connect/leaves/team-requests', isActive: false })
      }
      else {
        isTabActive = false;
      }
      this._hS.updateHeaderData({
        title: 'Leaves',
        tabs: tabs,
        isTab: isTabActive,
      })
    }

    this.getCurrentMonthDateFormatted();
    this.getLeavetypes();
    //this.getLeaveStatus();
    this.getLeaves();
    this.getLeaveQuote();
  }
  checkPermission(permissionName: string) {

    const isAccessible = this._per.hasPermission(permissionName)
    return isAccessible
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
  getLeaves() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      leaveType: this.leaveType,
      leaveStatus: this.leaveStatus,
      sortBy: this.sortBy
    }

    this.spinner.show();
    this._lS.getLeaves(data).subscribe((res) => {

      this.leaveItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.leaveItems.forEach(element => {
        element.date = this.datePipe.transform(element.leaveStartDate, 'MMM dd, yyyy') + "/" + this.datePipe.transform(element.leaveEndDate, 'MMM dd, yyyy')
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
      this.spinner.hide();
    })

  }
  get leaveStatusKeys() {
    const keys = Object.keys(this.leaveStatuss);

    return keys
  }
  get lF() {
    return this.applyLeaveForm.controls
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
      this.getLeaves();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getLeaves();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getLeaves();
    }
  }

  getLeavetypes() {
    this._dropdownS.getLeaveTypesForDD().subscribe((res) => {
      this.leaveTypes = res.data;
    })
  }
  // getLeaveStatus() {
  //   this._dropdownS.getLeaveStatusForDD().subscribe((res) => {
  //     this.leaveStatuss = res.data;
  //   })
  // }

  getLeaveQuote() {
    this._lS.getLeaveQoutaByEmployeeId(Number(localStorage.getItem('userId'))).subscribe((res) => {
      this.leaveQuota = res.leaveQuota;
      this.remainingleaves = res.remainingleaves;
      // res.leaveTypes.forEach((element) => {
      //   this.leaveQuota[element.leaveName] = element.leaveAvailability;
      // })
    })
  }


  generalFilter() {
    this.getLeaves();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getLeaves();
      this.getLeaveQuote();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  filterByLeaveType(leaveTypeName, leaveTypeId) {
    this.leaveType = Number(leaveTypeId);
    this.selectedLeaveType = leaveTypeName;
    this.getLeaves();
  }

  filterByStatus(key: any) {
    this.leaveStatus = Number(this.leaveStatuss[key]);
    this.selectedLeaveStatus = key;
    this.getLeaves();
  }

  sortDataBy(columnName) {
    this.sortBy = columnName.trim();
    this.getLeaves();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentMonthDateFormatted();
    this.leaveType = 0;
    this.selectedLeaveType = "Leaves Type";
    this.selectedLeaveStatus = "Status";
    this.leaveStatus = 0;
    this.sortBy = "";
    this.getLeaves();
  }
  adjustColumns() {

  }
  getLeaveDetails() {
    debugger
    this._lS.getLeaveById(this.currentId).subscribe((res) => {

      const parsedStartDate = new Date(res.leaveStartDate);
      res.leaveStartDate = this.datePipe.transform(parsedStartDate, 'yyyy-MM-dd');
      const parsedEndDate = new Date(res.leaveEndDate);
      res.leaveEndDate = this.datePipe.transform(parsedEndDate, 'yyyy-MM-dd');
      this.applyLeaveForm.patchValue(res.data)
    })
  }

  getLeaveSummary(requester, content) {
    this.openEnd(content)
    this._lS.getLeaveRequestSummary(requester.leaveId).subscribe(res => {
      debugger
      console.log("Leave summary", res);
      this.requesterDetails = {
        "leaveType": res.data.leaveType,
        "leaveId": requester.leaveId,
        "leaveStatusId": requester.leaveStatusId,
        "duration": res.data.duration,
        "startDate": this.datePipe.transform(res.data.startDate, 'MMM dd, yyyy'),
        "endDate": this.datePipe.transform(res.data.endDate, 'MMM dd, yyyy'),
        "appliedDate": this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "reason": res.data.reason,
        "requester": res.data.requester,
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
  get cF() {
    return this.applyLeaveForm.controls
  }

  setLeaveDates() {
    const startDate = this.applyLeaveForm.get('leaveStartDate').value;
    const startDateObj = new Date(startDate);
    const year = startDateObj.getFullYear();
    //this.applyLeaveForm.get('year').setValue(String(year));
  }


  canCelForm(content) {
    this.applyLeaveForm.reset();
    this.closeOffset(content);
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
    if (this.applyLeaveForm.valid) {
      this.isButtonDisabled = true;
      this.setLeaveDates();
      this.applyLeaveForm.get('userId').setValue(Number(localStorage.getItem('userId')))
      if (this.currentId !== 0 && this.currentId !== undefined) {

        const data = this.applyLeaveForm.value;
        this._lS.updateLeave(data).subscribe((res) => {
          this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            debugger
            this.closeOffset(content);
            this.applyLeaveForm.reset();
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Leave Updated Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this.getLeaveQuote()
            this.getLeaves();
            this._toastS.hide();
          }

        }, (error: any) => {
          this.closeOffset(content);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
          this.isButtonDisabled = false;
        })
      }
      else {

        const data = this.applyLeaveForm.value;
        this._lS.createLeave(data).subscribe((res) => {
          this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            this.applyLeaveForm.reset();
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Leave Added Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this.getLeaveQuote()
            this.getLeaves();
            this._toastS.hide();

          }
          if (res.statusCode === 400) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: res.message }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
          }

        }, (error: any) => {
          this.closeOffset(content);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
    }
    else {
      this.markFormGroupTouched(this.applyLeaveForm);
    }

  }
  editLeave(id: any, content) {
    this.currentId = id;
    this.getLeaveDetails();
    this.openEnd(content);

  }
  get isAllPending() {
    return this.requestStages.some((item) => item.status !== 1)
  }
  cancelRequest(id: any, content) {

    this._lS.cancelLeave(id).subscribe((res) => {
      this.closeOffset(content)
      if (res.statusCode === 200) {
        // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
        // this.leaveItems = leaves;
        this.getLeaves();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Canceled", toastParagrahp: "Leave Canceled Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this.getLeaveQuote()
        this._toastS.hide();
      }
    }, (error: any) => {

      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }
  deleteLeave(id: any) {

    this._lS.deleteLeave(id).subscribe((res) => {

      if (res.statusCode === 200) {
        // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
        // this.leaveItems = leaves;
        this.getLeaves();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Leave Deleted Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this.getLeaveQuote()
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
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      leaveType: this.leaveType,
      leaveStatus: this.leaveStatus,
      sortBy: this.sortBy
    }
    this._lS.getLeaveReport(obj).subscribe((res: any) => {
      debugger
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'LeaveDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }

}
