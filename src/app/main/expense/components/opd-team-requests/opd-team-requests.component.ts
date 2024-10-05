import { DatePipe } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status } from 'src/app/shared/models/statuss';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { Router } from '@angular/router';
import { OpdService } from '../../services/opd.service';
import * as moment from 'moment';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-opd-team-requests',
  templateUrl: './opd-team-requests.component.html',
  styleUrls: ['./opd-team-requests.component.css']
})
export class OpdTeamRequestsComponent {
  opdItems: any = [];
  desColumns = ["expenseDate", "patientName", "relation", "totalExpense", "expenseStatus"];
  columnNames = ['Date', 'Patient Name', 'Relation', "Expense", 'Status'];
  statuss = Status;
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  totalExpense: number = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  text = "";
  startDate = "";
  endDate = "";
  isActive = false;
  status: any;
  opdStatus = 0;
  selectedOpdStatus = "";
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  summaryItem: any = {};
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
  //   summaryToggle:boolean = false;
  // toggleSummary(){
  //   this.summaryToggle=!this.summaryToggle
  // }

  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _dDFS: DateTimeFormatService, private _opdS: OpdService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private _route: Router, private _per: MenuPermissionService) {
    // _hS.updateHeaderData({
    //   title: 'OPD Medical Expense',
    //   tabs: [{ title: 'OPD Medical Expense', url: 'connect/expense/opdmedical', isActive: false }, { title: 'Team Requests', url: 'connect/expense/opdmedical/team-requests', isActive: true }],
    //   isTab: true,
    // })
    let tabs = [];
    let isTabActive = true;
    if (_per.hasPermission('OPD Medical Expense')) {
      tabs.push({ title: 'OPD Medical Expense', url: 'connect/expense/opdmedical', isActive: false })
    }
    if (_per.hasPermission('Team OPD Medical Expense')) {
      tabs.push({ title: 'Team Requests', url: 'connect/expense/opdmedical/team-requests', isActive: true })
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
    this.getTeamOpd();
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

  calculateSerialNumber(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getTeamOpd();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeamOpd();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getTeamOpd();
    }
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getTeamOpd();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  getTeamOpd() {

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

    this._opdS.getAllTeamOpd(data).subscribe((res) => {
      this.opdItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.opdItems.forEach(element => {
        element.expenseDate =this.datePipe.transform(element.expenseDate, 'MMM dd, yyyy');;
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
      this.totalExpense = res.totalExpense;
      this.spinner.hide();

    })

  }
  generalFilter() {
    this.getTeamOpd();
  }

  get opdStatusKeys() {
    const keys = Object.keys(this.opdStatus);
    return keys
  }
  filterByStatus(key: any) {

    this.opdStatus = Number(this.statuss[key]);
    this.selectedOpdStatus = key;
    this.getTeamOpd();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();
    this.opdStatus = 0;
    this.selectedOpdStatus = "Status";
    this.sortBy = "";
    this.getTeamOpd();
  }


  updateRequest(reqstageId: number, statusId: number, content) {

    // this.summaryToggle=false;
    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._opdS.updateRequestStage(data).subscribe((res) => {
      this.closeOffset(content);
      if (res.statusCode === 200) {
        let message = ""
        if (statusId === 2) {
          message = "You have approved successfully."
        }
        if (statusId === 3) {
          message = "You have rejected."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getTeamOpd();
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
  getOpdSummary(requester, content) {
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
    this._opdS.getOpdRequestSummary(requester.medicalExpenseId).subscribe(res => {


      this.requesterDetails = {
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
    this._opdS.getOpdTeamReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'OpdDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}
