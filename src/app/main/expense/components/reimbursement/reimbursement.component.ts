import { DatePipe } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status } from 'src/app/shared/models/statuss';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reimbursement',
  templateUrl: './reimbursement.component.html',
  styleUrls: ['./reimbursement.component.css']
})
export class ReimbursementComponent {
  reimbursementItems: any = [];
  isButtonDisabled = false;
  desColumns = ["reimbursementDate", "reimbursementType", "totalExpense", "reimbursementStatus"];
  columnNames = ['Date', 'Type', 'Expense', 'Status'];
  statuss = Status;
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  totalExpense: number = 0;
  pageNumber = 1;
  showOffcanvas: boolean = false;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  text = "";
  startDate = "";
  endDate = "";
  selectedFiles: File[] = [];
  reimbursementStatus = 0;
  selectedReimbursementStatus = "";
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  summaryAttachments: any[] = [];
  reimbursementForm = new FormGroup({
    ReimbursementId: new FormControl(0),
    ReimbursementDate: new FormControl('', [Validators.required]),
    TotalExpense: new FormControl(null, [Validators.required]),
    ReimbursementType: new FormControl(null, [Validators.required]),
    Notes: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    Status: new FormControl(1),
    UserId: new FormControl(Number(localStorage.getItem('userId'))),
    Files: new FormArray([])
  })
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.resetForm();
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.resetForm();
    this.offcanvasService.dismiss(content);
  }
  get rF() {
    return this.reimbursementForm.controls
  }
  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _dDFS: DateTimeFormatService, private _reiS: ReimbursementService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private _route: Router, private _per: MenuPermissionService) {
    // _hS.updateHeaderData({
    //   title: 'Reimbursement',
    //   tabs: [{ title: 'Reimbursement', url: 'connect/expense/reimbursement', isActive: true }, { title: 'Team Requests', url: 'connect/expense/reimbursement/team-requests', isActive: false }],
    //   isTab: true,
    // })
    let tabs = [];
    let isTabActive = true;
    if (_per.hasPermission('Reimbursement')) {
      tabs.push({ title: 'Reimbursement', url: 'connect/expense/reimbursement', isActive: true })
    }
    if (_per.hasPermission('Team Reimbursement')) {
      tabs.push({ title: 'Team Requests', url: 'connect/expense/reimbursement/team-requests', isActive: false })
    }
    else {
      isTabActive = false;
      this._route.navigateByUrl('connect/expense/reimbursement');
    }
    _hS.updateHeaderData({
      title: 'Reimbursement',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  ngOnInit(): void {
    this.getCurrentYearDateFormatted();
    this.getReimbursement();
  }

  getReimbursement() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.reimbursementStatus,
      sortBy: this.sortBy
    }
    this.spinner.show();

    this._reiS.getReimbursement(data).subscribe((res) => {
      this.reimbursementItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.reimbursementItems.forEach(element => {
        element.reimbursementDate = this.datePipe.transform(element.reimbursementDate, 'MMM dd, yyyy');;
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
      this.totalExpense = res.totalExpense;
      this.spinner.hide();
    })

  }
  get reimbursementStatusKeys() {
    const keys = Object.keys(this.statuss);

    return keys
  }
  getCurrentYearDateFormatted() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1); // January 1st
    const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31st
    const parsedStartDate = this.datePipe.transform(startOfYear, 'yyyy-MM-dd');
    const parsedEndDate = this.datePipe.transform(endOfYear, 'yyyy-MM-dd');
    this.startDate = parsedStartDate;
    this.endDate = parsedEndDate;
  }
  generalFilter() {
    this.getReimbursement();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getReimbursement();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }

  filterByStatus(key: any) {
    this.reimbursementStatus = Number(this.statuss[key]);
    this.selectedReimbursementStatus = key;

    this.getReimbursement();
  }

  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getReimbursement();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();
    this.selectedReimbursementStatus = "Status";
    this.reimbursementStatus = 0;
    this.sortBy = "";
    this.getReimbursement();
  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getReimbursement();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getReimbursement();
    }
  }
  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getReimbursement();
    }
  }
  getReimbursementDetails() {
    this._reiS.getReimbursementById(this.currentId).subscribe((res) => {
      const parsedpfDate = new Date(res.data.pfDate);
      res.data.pfDate = this.datePipe.transform(parsedpfDate, 'MMM dd, yyyy');
      this.reimbursementForm.patchValue(res);
    })
  }
  onFileSelected(event: Event) {

    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedFiles = [];
      for (let i = 0; i < fileInput.files.length; i++) {
        this.selectedFiles.push(fileInput.files[i]);
      }
    }
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
    if (this.reimbursementForm.valid) {
      this.isButtonDisabled = true;

      console.log('submitForm', this.reimbursementForm.value)
      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('Files', this.selectedFiles[i]);
      }
      Object.keys(this.rF).forEach(key => {
        if (key !== 'Files') {
          formData.append(key, this.reimbursementForm.value[key]);
        }
      })
      if (this.currentId !== 0 && this.currentId !== undefined) {
        //this.opdForm.get('MedicalExpenseId').setValue(this.currentId);
        formData['ReimbursementId'] = this.currentId;
        const data = formData;
        this._reiS.updateReimbursement(data).subscribe((res) => {
          this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Reimbursement Updated Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
            this.getReimbursement();
          }

        }, (error: any) => {
          this.closeOffset(content);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
      else {
        const data = formData;
        this._reiS.createReimbursement(data).subscribe((res) => {
          if (res.statusCode === 200) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Reimbursement Added Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
            this.getReimbursement();
          }
          if (res.statusCode === 400) {

            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: res.data }
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
      this.markFormGroupTouched(this.reimbursementForm);
    }

  }
  resetForm() {
    // this.showOffcanvas = !this.showOffcanvas;
    this.reimbursementForm.reset(
      {
        ReimbursementId: 0,
        ReimbursementDate: '',
        TotalExpense: null,
        ReimbursementType: null,
        Notes: '',
        Status: 1,
        UserId: Number(localStorage.getItem('userId')),
        Files: []
      }
    )
  }
  editReimbursement(id: any) {
    this.currentId = id;
    this.getReimbursementDetails();
  }
  get isAllPending() {
    return this.requestStages.some((item) => item.status !== 1)
  }
  cancelRequest(id: any, content) {

    this._reiS.cancelReimbursement(id).subscribe((res) => {
      this.closeOffset(content)
      if (res.statusCode === 200) {
        // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
        // this.leaveItems = leaves;
        this.getReimbursement();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Canceled", toastParagrahp: "Reimbursement Canceled Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this.getReimbursement();
        this._toastS.hide();
      }
    }, (error: any) => {
      this.closeOffset(content)
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }
  deleteReimbursement(id: any) {
    this._reiS.deleteReimbursement(id).subscribe((res) => {
      if (res.statusCode === 200) {
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Reimbursement Deleted Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
        this.getReimbursement();
      }
    }, (error: any) => {

      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }


  getReimbursementSummary(requester, content) {
    this.spinner.show();
    this._reiS.getReimbursementRequestSummary(requester.reimbursementId).subscribe(res => {
      this.openEnd(content)
      this.spinner.hide();
      this.summaryAttachments = res.data.reimbursementAttachments;
      this.requesterDetails = {
        "reimbursementId": requester.reimbursementId,
        "statusId": res.data.reimbursementStatusId,
        "reimbursementDate": this.datePipe.transform(res.data.reimbursementDate, 'MMM dd, yyyy'),
        "reimbursementType": res.data.reimbursementType,
        "totalExpense": res.data.totalExpense,
        "notes": res.data.notes,
        "requester": res.data.requester,
        "appliedDate": this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
      }

      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate = this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
    })
  }
  exportData() {
    const obj = {
      "startDate": this.startDate,
      "endDate": this.endDate
    };
    this._reiS.getReimbursementReport(obj).subscribe((res: any) => {
      debugger
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'ReibursementDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}
