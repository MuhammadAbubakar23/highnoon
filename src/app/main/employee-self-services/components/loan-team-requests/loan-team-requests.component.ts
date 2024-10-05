import { DatePipe } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status } from 'src/app/shared/models/statuss';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { ProvidentFundService } from '../../services/provident-fund.service';
import * as moment from 'moment';
import { LoanService } from '../../services/loan.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loan-team-requests',
  templateUrl: './loan-team-requests.component.html',
  styleUrls: ['./loan-team-requests.component.css']
})
export class LoanTeamRequestsComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage = 10;
  text = "";
  startDate = "";
  endDate = "";
  isActive = false;
  status: any;
  imageBaseUrl = environment.imageBaseUrl;
  currentDate = new Date();
  selectedLoanStatus = "";
  loanType = 0;
  selectedLoanType = "";
  loanTypes: any[] = [];
  loanStatuss = Status;
  loanStatus = 0;
  sortBy = "";
  loanTeamItems: any = [];
  desColumns = ["userName", "loanType", "amount", "date", "status"];
  columnNames = ["Name", 'Loan Type', 'Amount', 'Date', 'Status'];
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  totalRequest: number = 0;
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
  get rF() {
    return this.teamRequestForm.controls;
  }
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  // summaryToggle: boolean = false;
  // toggleSummary() {
  //   this.summaryToggle = !this.summaryToggle
  // }
  constructor(private _hS: HeaderService, private _lS: LoanService, private _toastS: ToasterService, private _dropdownS: DropDownApiService
    , private datePipe: DatePipe, private spinner: NgxSpinnerService, private _per: MenuPermissionService, private _route: Router) {
    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Loans')) {
      tabs.push({ title: 'Loans', url: 'connect/employee-self-services/loans', isActive: false })
    }
    if (this._per.hasPermission('Team Loans')) {
      tabs.push({ title: 'Team Requests', url: 'connect/employee-self-services/loans/team-requests', isActive: true })
    }
    else {
      isTabActive = false;
      this._route.navigateByUrl('/connect/employee-self-services/loans');
    }
    this._hS.updateHeaderData({
      title: 'Employee Loans',
      tabs: tabs,
      isTab: isTabActive,
    })

  }
  ngOnInit(): void {
    this.getCurrentYearDateFormatted();
    this.getTeamLoan();
    this.getLoanTypes();
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
  getLoanTypes() {
    this._dropdownS.getLoanTypeForDD().subscribe((res) => {
      this.loanTypes = res.data;
    })
  }
  calculateSerialNumber(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
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
      this.getTeamLoan();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeamLoan();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getTeamLoan();
    }
  }

  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getTeamLoan();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  getTeamLoan() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.loanStatus,
      sortBy: this.sortBy
    }
    //this.spinner.show();

    this._lS.getAllTeamLoan(data).subscribe((res) => {
      this.loanTeamItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.loanTeamItems.forEach(element => {
        element.date = moment(element.date).format("MMM D, YYYY");;
      });
      console.log("loanTeamItems", this.loanTeamItems.length)
      this.totalRequest = this.approved + this.pending + this.rejected;

      this.spinner.hide();

    })

  }
  generalFilter() {
    this.getTeamLoan();
  }

  get loanStatusKeys() {
    const keys = Object.keys(this.loanStatuss);
    return keys
  }
  filterByLoanType(loanTypeName, loanTypeId) {
    this.loanType = Number(loanTypeId);
    this.selectedLoanType = loanTypeName;
    this.getTeamLoan();
  }
  filterByStatus(key: any) {

    this.loanStatus = Number(this.loanStatuss[key]);
    this.selectedLoanStatus = key;
    this.getTeamLoan();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();
    this.selectedLoanStatus = "Status";
    this.loanStatus = 0;
    this.sortBy = "";
    this.loanType = 0;
    this.getTeamLoan();
  }


  updateRequest(reqstageId: number, statusId: number, content) {
    // this.summaryToggle = false;

    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._lS.updateRequestStage(data).subscribe((res) => {
      this.closeOffset(content);
      if (res.statusCode === 200) {
        let message = ""
        if (statusId === 2) {
          message = "You have approved successfully."
        }
        if (statusId === 3) {
          message = "You have rejected."
        }
        if (statusId === 5) {
          message = "You holded the request succesfully."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getTeamLoan();
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
  updateRequestStageId(id: number) {
    this.currentRequestStageId = id;
    this.teamRequestForm.reset();
  }
  exportData() {
    const obj = {
      "startDate": this.startDate,
      "endDate": this.endDate
    };
    this._lS.getTeamLoanReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'TeamProvidentFundDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
  getLoanSummary(requester, content) {
    // this.toggleSummary();
    this.isActive = requester.requestStage.isActive;
    this.status= requester.requestStage.status;
    this.openEnd(content);
    console.log("requester", requester)
    this.teamRequestForm.reset();
    this.currentRequestStageId = requester.requestStage.requestStageId;
    //this.currentRequestStageId = requester.pfRequestId;
    this.summaryItem = requester;
    console.log("Summary", this.summaryItem);
    this._lS.getLoanRequestSummary(requester.loanId).subscribe(res => {
      this.requesterDetails = {
        "appliedAt":   this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "loanType": res.data.loanType,
        "loanAmount": res.data.amount,
        "notes": res.data.notes,
        "requester": res.data.requester,
        "loanAttachments": res.data.loanAttachments
      }
      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =   this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate =  this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
    })
  }


}
