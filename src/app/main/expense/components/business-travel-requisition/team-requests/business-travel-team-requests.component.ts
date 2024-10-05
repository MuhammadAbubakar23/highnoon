import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { Status } from 'src/app/shared/models/statuss';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { BusinessTravelRequisitionService } from '../../../services/business-travel-requisition.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';

@Component({
  selector: 'app-business-travel-team-requests',
  templateUrl: './business-travel-team-requests.component.html',
  styleUrls: ['./business-travel-team-requests.component.css']
})
export class BusinessTravelTeamRequestsComponent implements OnInit {
  requisitionItems: any = [];
  currentRequestStageId = 0;
  isButtonDisabled = false;
  desColumns = ["createdDate", "requestName", "userName", "totalExpense", "status"];
  columnNames = ['Date', 'Name', 'Requester', 'Expense', 'Status'];
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
  selectedFiles: File[] = [];
  RequisitionStatus = 0;
  selectedRequisitionStatus = "";
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  summaryAttachments: any[] = [];
  summaryToggle: boolean = false;
  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
        Validators.maxLength(200)])
    }
  )
  get rF() {
    return this.teamRequestForm.controls;
  }
  toggleSummary() {
    this.summaryToggle = !this.summaryToggle
  }

  constructor(_hS: HeaderService, private spinner: NgxSpinnerService, private _toastS: ToasterService, private datePipe: DatePipe,
    private _reiS: BusinessTravelRequisitionService, private _route: Router, private _per: MenuPermissionService) {
    // _hS.updateHeaderData({
    //   title: 'Business Travel Requisition',
    //   tabs: [{ title: 'Business Travel Requisition', url: 'connect/expense/businesstravelrequisition', isActive: false }, { title: 'Team Requests', url: 'connect/expense/business-travel-requisition/team-requests', isActive: true }],
    //   isTab: true,
    // })
    let tabs = [];
    let isTabActive = true;
    if (_per.hasPermission('Business Travel Requisition')) {
      tabs.push({ title: 'Business Travel Requisition', url: 'connect/expense/businesstravelrequisition', isActive: false })
    }
    if (_per.hasPermission('Team Business Travel Requisition')) {
      tabs.push({ title: 'Team Requests', url: 'connect/expense/business-travel-requisition/team-requests', isActive: true })
    }
    else {
      isTabActive = false;
      this._route.navigateByUrl('connect/expense/businesstravelrequisition');
    }
    _hS.updateHeaderData({
      title: 'Business Travel Requisition',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  ngOnInit() {
    this.getCurrentYearDateFormatted();
    this.getRequisition();
  }
  getRequisition() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      travelStatus: this.RequisitionStatus,
      sortBy: this.sortBy
    }
    this.spinner.show();

    this._reiS.getTeamRequisition(data).subscribe((res) => {
      this.spinner.hide();
      this.requisitionItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.requisitionItems?.forEach(element => {
        element.createdDate = this.datePipe.transform(element.createdDate, 'MMM dd, yyyy');;
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
      this.totalExpense = res.totalAdvanceCurrency;
    })

  }

  get requisitionStatusKeys() {
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
    this.getRequisition();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getRequisition();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }

  filterByStatus(key: any) {
    this.RequisitionStatus = Number(this.statuss[key]);
    this.selectedRequisitionStatus = key;

    this.getRequisition();
  }

  sortDataBy(columnName) {

    this.sortBy = columnName;
    this.getRequisition();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();
    this.selectedRequisitionStatus = "Status";
    this.RequisitionStatus = 0;
    this.sortBy = "";
    this.getRequisition();
  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getRequisition();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getRequisition();
    }
  }
  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getRequisition();
    }
  }
  getRequisitionSummary(item) {
    const url = `/connect/expense/business-travel-requisition-team-requests/${item.travelRequisitionMasterId}`;
    // const state = { isActive: item.requestStage?.isActive, status: item.requestStage?.status };
    this._route.navigateByUrl(url);
  }

  updateRequest(reqstageId: number, statusId: number) {
    this.summaryToggle = false;
    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._reiS.updateRequestStage(data).subscribe((res) => {
      if (res.statusCode === 200) {
        let message = ""
        if (statusId === 2) {
          message = "You have approved the Requisition successfully."
        }
        if (statusId === 3) {
          message = "You have rejected the Requisition."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getRequisition();
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
    this._reiS.getRequisitionTeamReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'RequisitionTeamDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}

