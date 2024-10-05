import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status } from 'src/app/shared/models/statuss';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reimbursement-team-requests',
  templateUrl: './reimbursement-team-requests.component.html',
  styleUrls: ['./reimbursement-team-requests.component.css']
})
export class ReimbursementTeamRequestsComponent implements OnInit {
  reimbursementItems: any = [];
  desColumns = ["reimbursementDate", "reimbursementType", "totalExpense", "reimbursementStatus"];
  columnNames = ['Date', 'Type', 'Expense', 'Status'];
  statuss = Status;
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  totalExpense = 0;
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
  reimbursementStatus = 0;
  selectedReimbursementStatus = "";
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  summaryItem: any = {};
  currentRequestStageId = 0;
  summaryAttachments: any[] = [];
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
  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _dDFS: DateTimeFormatService, private _reiS: ReimbursementService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private _per: MenuPermissionService, private _route: Router) {
    // _hS.updateHeaderData({
    //   title: 'Reimbursement',
    //   tabs: [{ title: 'Reimbursement', url: 'connect/expense/reimbursement', isActive: true }, { title: 'Team Requests', url: 'connect/expense/reimbursement/team-requests', isActive: false }],
    //   isTab: true,
    // })
    let tabs = [];
    let isTabActive = true;
    if (_per.hasPermission('Reimbursement')) {
      tabs.push({ title: 'Reimbursement', url: 'connect/expense/reimbursement', isActive: false })
    }
    if (_per.hasPermission('Team Reimbursement')) {
      tabs.push({ title: 'Team Requests', url: 'connect/expense/reimbursement/team-requests', isActive: true })
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
    this.getTeamReimbursement();
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
      this.getTeamReimbursement();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeamReimbursement();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getTeamReimbursement();
    }
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getTeamReimbursement();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  getTeamReimbursement() {
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

    this._reiS.getAllTeamReimbursement(data).subscribe((res) => {
      this.spinner.hide();
      this.reimbursementItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.reimbursementItems.forEach(element => {
        element.reimbursementDate = this.datePipe.transform(element.reimbursementDate,'MMM dd, yyyy');;
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
      this.totalExpense = res.totalExpense;

    })

  }
  generalFilter() {
    this.getTeamReimbursement();
  }

  get reimbursementStatusKeys() {
    const keys = Object.keys(this.statuss);
    return keys
  }
  filterByStatus(key: any) {

    this.reimbursementStatus = Number(this.statuss[key]);
    this.selectedReimbursementStatus = key;
    this.getTeamReimbursement();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();
    this.reimbursementStatus = 0;
    this.selectedReimbursementStatus = "Status";
    this.sortBy = "";
    this.getTeamReimbursement();
  }


  updateRequest(reqstageId: number, statusId: number, content) {
    // this.summaryToggle=false;

    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._reiS.updateRequestStage(data).subscribe((res) => {
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
        this.getTeamReimbursement();
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
  getReimbursementSummary(requester, content) {

    this.isActive = requester.requestStage.isActive;
    this.status= requester.requestStage.status;
    // this.toggleSummary();
    this.openEnd(content);
    console.log("requester", requester)
    this.teamRequestForm.reset();
    this.currentRequestStageId = requester.requestStage.requestStageId;
    //this.currentRequestStageId = requester.pfRequestId;
    this.summaryItem = requester;
    console.log("Summary", this.summaryItem);
    this._reiS.getReimbursementRequestSummary(requester.reimbursementId).subscribe(res => {

      this.summaryAttachments = res.data.reimbursementAttachments;

      this.requesterDetails = {
        "reimbursementDate": this.datePipe.transform(res.data.reimbursementDate, 'MMM dd, yyyy'),
        "reimbursementType": res.data.reimbursementType,
        "totalExpense": res.data.totalExpense,
        "notes": res.data.notes,
        "requester": res.data.requester,
        "appliedDate":this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
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
    this._reiS.getTeamReimbursementReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'ReimbursementDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}

