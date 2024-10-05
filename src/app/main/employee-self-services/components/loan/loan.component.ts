import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { ProvidentFundService } from '../../services/provident-fund.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { Status } from 'src/app/shared/models/statuss';
import * as moment from 'moment';
import { LoanService } from '../../services/loan.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { environment } from 'src/environments/environment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent {
  loanItems: any = [];
  desColumns = ["loanType", "amount", "date", "status"];
  columnNames = ['Loan Type', 'Amount', 'Date', 'Status'];
  statuss = Status;
  totalRequest: number = 0;
  loanType = "";
  selectedLoanType = "";
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
  loanStatus = 0;
  selectedLoanStatus = "";
  sortBy = "";
  selectedSort = ""
  imageBaseUrl = environment.imageBaseUrl;
  currentId = 0;
  fileArray = [];
  showOffcanvas: boolean = false;
  requesterDetails: any = {};
  requestStages: any = [];
  isButtonDisabled = false;
  loanTypes: any[] = [];
  loanForm = new FormGroup({
    LoanId: new FormControl(0),
    Date: new FormControl('', [Validators.required]),
    LoanTypeId: new FormControl(null, [Validators.required]),
    Amount: new FormControl(0, [Validators.required]),
    Notes: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    Status: new FormControl(1),
    UserId: new FormControl(0),
    Files: new FormArray([]),


  })
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  get lF() {
    return this.loanForm.controls
  }

  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _lS: LoanService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private _dropDown: DropDownApiService, private _per: MenuPermissionService) {
    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Loans')) {
      tabs.push({ title: 'Loans', url: 'connect/employee-self-services/loans', isActive: true })
    }
    if (this._per.hasPermission('Team Loans')) {
      tabs.push({ title: 'Team Requests', url: 'connect/employee-self-services/loans/team-requests', isActive: false })
    }
    else {
      isTabActive = false;
    }
    this._hS.updateHeaderData({
      title: 'Employee Loans',
      tabs: tabs,
      isTab: isTabActive,
    })


  }

  ngOnInit(): void {
    this.getCurrentYearDateFormatted();
    this.getLoans();
    this.getLoanTypes();
  }

  getLoans() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      loanType: String(this.loanType),
      status: this.loanStatus,
      sortBy: this.sortBy
    }
    this.spinner.show();

    this._lS.getLoan(data).subscribe((res) => {
      this.spinner.hide();
      this.loanItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.loanItems.forEach(element => {
        element.date = moment(element.date).format("MMM D, YYYY");
      });
      this.approved = res.pagedReponse.approved;
      this.pending = res.pagedReponse.pending;
      this.rejected = res.pagedReponse.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;

    })

  }
  getLoanTypes() {
    this._dropDown.getLoanTypeForDD().subscribe((res) => {
      this.loanTypes = res.data;
    })
  }
  get loanStatusKeys() {
    const keys = Object.keys(this.statuss);
    return keys
  }
  getCurrentYearDateFormatted() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const parsedStartDate = this.datePipe.transform(startOfYear, 'yyyy-MM-dd');
    const parsedEndDate = this.datePipe.transform(endOfYear, 'yyyy-MM-dd');
    this.startDate = parsedStartDate;
    this.endDate = parsedEndDate;
  }
  generalFilter() {
    this.getLoans();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getLoans();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  filterByLoanType(loanTypeName, loanTypeId) {
    this.loanType = loanTypeId;
    this.selectedLoanType = loanTypeName;
    this.getLoans();
  }
  filterByStatus(key: any) {
    this.loanStatus = Number(this.statuss[key]);
    this.selectedLoanStatus = key;
    this.getLoans();
  }

  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getLoans();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();
    this.selectedLoanStatus = "Status";
    this.loanStatus = 0;
    this.sortBy = "";
    this.loanType = "";
    this.getLoans();
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
      this.getLoans();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getLoans();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getLoans();
    }
  }

  getLoanDetails(content) {
    this._lS.getLoanById(this.currentId).subscribe((res) => {
      const parsedpfDate = new Date(res.data.date);
      res.data.date = this.datePipe.transform(parsedpfDate, 'yyyy-MM-dd');
      this.loanForm.patchValue({
        LoanId: res.data.loanId,
        Date: res.data.date,
        LoanTypeId: res.data.loanTypeId,
        Amount: res.data.loanAmount,
        Notes: res.data.notes,
        Status: res.data.status,
        UserId: res.data.userId
      });
      this.openEnd(content);
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
  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {

      for (let i = 0; i < files.length; i++) {
        this.fileArray.push(files.item(i));
      }
    }
  }
  amount = 1000000000000000000
  submitForm(content) {

    if (this.loanForm.valid) {
      this.isButtonDisabled = true;
      this.loanForm.get('UserId').setValue(Number(localStorage.getItem('userId')))
      const formData = new FormData();
      formData.append('Date', this.loanForm.value['Date']);
      formData.append('LoanTypeId', String(this.loanForm.value['LoanTypeId']));
      formData.append('Amount', String(this.loanForm.value['Amount']));
      formData.append('Notes', this.loanForm.value['Notes']);
      formData.append('Status', String(this.loanForm.value['Status']));
      formData.append('UserId', String(this.loanForm.value['UserId']));
      for (let i = 0; i < this.fileArray.length; i++) {
        formData.append('Files', this.fileArray[i]);
      }
      if (this.currentId !== 0 && this.currentId !== undefined) {
        formData.append('LoanId', String(this.currentId));

        this._lS.updateLoan(formData).subscribe((res) => {
          this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Loan Updated Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
            this.getLoans();
          }

        }, (error: any) => {
          this.closeOffset(content);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
      else {
        formData.append('LoanId', String(this.currentId));
        this._lS.createLoan(formData).subscribe((res) => {
          if (res.statusCode === 200) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Request sent successfully", toastParagrahp: "Your Loan Request has been sent for approval." }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
            this.getLoans();
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
      this.markFormGroupTouched(this.loanForm);
    }

  }

  resetForm(content) {
    this.openEnd(content)
    this.loanForm.reset(
      {
        LoanId: 0,
        Date: '',
        LoanTypeId: null,
        Amount: 0,
        Notes: '',
        Status: 1,
        UserId: 0,
        Files: [],
      })
  }

  editLoan(id: any, content) {

    this.currentId = id;
    this.getLoanDetails(content);
  }
  cancelRequest(id: any, content) {

    this._lS.cancelLoan(id).subscribe((res) => {
      this.closeOffset(content)
      if (res.statusCode === 200) {
        // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
        // this.leaveItems = leaves;
        this.getLoans();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Canceled", toastParagrahp: "Loan Canceled Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      }
    }, (error: any) => {
      this.closeOffset(content)
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }
  deleteLoan(id: any) {
    this._lS.deleteLoan(id).subscribe((res) => {
      if (res.statusCode === 200) {
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Request deleted successfully", toastParagrahp: "Your Loan request has been deleted." }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
        this.getLoans();
      }
    }, (error: any) => {

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
    this._lS.getLoanReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'LoanDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
  get isAllPending() {
    return this.requestStages.some((item) => item.status !== 1)
  }
  getLoanSummary(requester, content) {
    this._lS.getLoanRequestSummary(requester.loanId).subscribe(res => {
      this.openEnd(content)
      this.spinner.hide();
      this.requesterDetails = {
        "appliedAt":  this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "loanId": requester.loanId,
        "loanType": res.data.loanType,
        "loanAmount": res.data.amount,
        "notes": res.data.notes,
        "requester": res.data.requester,
        "statusId": res.data.statusId,
        "loanAttachments": res.data.loanAttachments
      }

      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =   this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate =   this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
    })
  }

}

