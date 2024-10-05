import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Status } from 'src/app/shared/models/statuss';
import { HeaderService } from 'src/app/services/header.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { OpdService } from '../../services/opd.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from 'src/app/services/toaster.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-opd',
  templateUrl: './opd.component.html',
  styleUrls: ['./opd.component.css']
})
export class OpdComponent implements OnInit {
  opdItems: any = [];
  isButtonDisabled = false;
  desColumns = ["expenseDate", "patientName", "relation", "totalExpense", "expenseStatus"];
  columnNames = ['Date', 'Patient Name', 'Relation', "Expense", 'Status'];
  statuss = Status;
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  relations: any[] = [];
  showOffcanvas: boolean = false;
  totalExpense: number = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  text = "";
  startDate = "";
  endDate = "";
  opdStatus = 0;
  selectedOpdStatus = "";
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  selectedFiles: File[] = [];
  requesterDetails: any = {};
  requestStages: any = [];
  opdForm = new FormGroup({
    MedicalExpenseId: new FormControl(0),
    ExpenseDate: new FormControl('', [Validators.required]),
    PatientName: new FormControl('', [Validators.required]),
    Relation: new FormControl(null, [Validators.required]),
    DoctorName: new FormControl('', [Validators.required]),
    ProfessionalFees: new FormControl(null, [Validators.required]),
    TotalExpense: new FormControl(null, [Validators.required]),
    OtherCharges: new FormControl('', [Validators.required]),
    Status: new FormControl(1),
    Notes: new FormControl('', [Validators.required]),
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
  get oF() {
    return this.opdForm.controls
  }
  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _dDFS: DateTimeFormatService, private _opdS: OpdService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private fb: FormBuilder, private _DropDownS: DropDownApiService, private _route: Router, private _per: MenuPermissionService) {
    // _hS.updateHeaderData({
    //   title: 'OPD Medical Expense',
    //   tabs: [{ title: 'OPD Medical Expense', url: 'connect/expense/opdmedical', isActive: true }, { title: 'Team Requests', url: 'connect/expense/opdmedical/team-requests', isActive: false }],
    //   isTab: true,
    // })
    let tabs = [];
    let isTabActive = true;
    if (_per.hasPermission('OPD Medical Expense')) {
      tabs.push({ title: 'OPD Medical Expense', url: 'connect/expense/opdmedical', isActive: true })
    }
    if (_per.hasPermission('Team OPD Medical Expense')) {

      tabs.push({ title: 'Team Requests', url: 'connect/expense/opdmedical/team-requests', isActive: false })
    }
    else {
      isTabActive = false;
      this._route.navigateByUrl('connect/connect/expense/opdmedical');
    }
    _hS.updateHeaderData({
      title: 'OPD Medical Expense',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  ngOnInit(): void {
    this.getCurrentYearDateFormatted();
    this.getOpd();
    this.getRelations();
  }

  getOpd() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.opdStatus,
      sortBy: this.sortBy
    }
    this.spinner.show();

    this._opdS.getOpd(data).subscribe((res) => {
      this.opdItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.opdItems.forEach(element => {
        element.expenseDate = this.datePipe.transform(element.expenseDate, 'MMM dd, yyyy');;
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
      this.totalExpense = res.totalExpense;
      this.spinner.hide();
    })

  }
  getRelations() {
    this._DropDownS.getRelationForDD().subscribe((res) => {
      this.relations = res.data;
    })
  }
  get opdStatusKeys() {
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
    this.getOpd();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getOpd();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }

  filterByStatus(key: any) {
    this.opdStatus = Number(this.statuss[key]);
    this.selectedOpdStatus = key;
    this.getOpd();
  }

  sortDataBy(columnName) {

    this.sortBy = columnName;
    this.getOpd();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();
    this.selectedOpdStatus = "Status";
    this.opdStatus = 0;
    this.sortBy = "";
    this.getOpd();
  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getOpd();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getOpd();
    }
  }
  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getOpd();
    }
  }
  getOpdDetails() {
    this._opdS.getOpdById(this.currentId).subscribe((res) => {
      const parsedpfDate = new Date(res.data.pfDate);
      res.data.pfDate = this.datePipe.transform(parsedpfDate, 'yyyy-MM-dd');
      this.opdForm.patchValue({
        // MedicalExpenseId:
        // ExpenseDate:
        // PatientName:
        // Relation:
        // DoctorName:
        // ProfessionalFees:
        // TotalExpense:
        // OtherCharges:
        // Status:
        // Notes:
        // UserId:
        // Files:
      })
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
    if (this.opdForm.valid) {
      this.isButtonDisabled = true;


      console.log('submitForm', this.opdForm.value)
      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('Files', this.selectedFiles[i]);
      }
      Object.keys(this.oF).forEach(key => {
        if (key !== 'Files') {
          formData.append(key, this.opdForm.value[key]);
        }
      })
      if (this.currentId !== 0 && this.currentId !== undefined) {
        //this.opdForm.get('MedicalExpenseId').setValue(this.currentId);
        formData['MedicalExpenseId'] = this.currentId;
        const data = formData;
        this._opdS.updateOpd(data).subscribe((res) => {
          this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "OPD Updated Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
            this.getOpd();
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
        this._opdS.createOpd(data).subscribe((res) => {
          if (res.statusCode === 200) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "OPD Added Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
            this.getOpd();
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
      this.markFormGroupTouched(this.opdForm);
    }

  }
  resetForm() {
    // this.showOffcanvas = !this.showOffcanvas;
    // this.openEnd(content);
    this.opdForm.reset({
      MedicalExpenseId: 0,
      ExpenseDate: '',
      PatientName: '',
      Relation: null,
      DoctorName: '',
      ProfessionalFees: null,
      TotalExpense: null,
      OtherCharges: '',
      Status: 1,
      Notes: '',
      UserId: Number(localStorage.getItem('userId')),
      Files: []
    })
  }
  editOpd(id: any) {
    this.currentId = id;
    this.getOpdDetails();
  }
  get isAllPending() {
    return this.requestStages.some((item) => item.status !== 1)
  }
  cancelRequest(id: any, content) {

    this._opdS.cancelOpd(id).subscribe((res) => {
      this.closeOffset(content)
      if (res.statusCode === 200) {
        // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
        // this.leaveItems = leaves;
        this.getOpdDetails();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Canceled", toastParagrahp: "OPD Canceled Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this.getOpdDetails()
        this._toastS.hide();
      }
    }, (error: any) => {
      this.closeOffset(content)
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }
  deleteOpd(id: any) {
    this._opdS.deleteOpd(id).subscribe((res) => {
      if (res.statusCode === 200) {
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "OPD Deleted Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
        this.getOpd();
      }
    }, (error: any) => {

      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }


  getOpdSummary(requester, content) {
    this.spinner.show();
    this._opdS.getOpdRequestSummary(requester.medicalExpenseId).subscribe(res => {
      this.openEnd(content)
      this.spinner.hide();
      this.requesterDetails = {
        "opdId": requester.medicalExpenseId,
        "statusId": res.data.expenseStatusId,
        "expenseStatus": res.data.expenseStatus,
        "patientName": res.data.patientName,
        "relation": res.data.relation,
        "doctorName": res.data.doctorName,
        "professionalFees": res.data.professionalFees,
        "totalExpense": res.data.totalExpense,
        "otherCharges": res.data.otherCharges,
        "notes": res.data.notes,
        "requester": res.data.requester,
        "appliedDate": this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
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
    })
  }
  exportData() {
    const obj = {
      "startDate": this.startDate,
      "endDate": this.endDate
    };
    this._opdS.getOpdReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'OpdDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}


