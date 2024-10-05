import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { Status } from 'src/app/shared/models/statuss';
import { DatePipe } from '@angular/common';
import { BusinessTravelReimbursementService } from '../../services/business-travel-reimbursement.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-travel-reimbursement',
  templateUrl: './business-travel-reimbursement.component.html',
  styleUrls: ['./business-travel-reimbursement.component.css']
})
export class BusinessTravelReimbursementComponent implements OnInit {
  showOffcanvas: boolean = false;
  reimbursementItems: any = [];
  requisitionItems: any = [];
  isButtonDisabled = false;
  desColumns = ["createdDate", 'tripName', "totalExpense", "status"];
  columnNames = ['Date', 'Name', 'Expense', 'Status'];
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
  ReimbursementStatus = 0;
  selectedReimbursementStatus = "";
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  summaryAttachments: any[] = [];

  constructor(_hS: HeaderService, private spinner: NgxSpinnerService, private _toastS: ToasterService, private datePipe: DatePipe,
    private _reiS: BusinessTravelReimbursementService, private _route: Router, private _per: MenuPermissionService) {
    // _hS.updateHeaderData({
    //   title: 'Business Travel Reimbursement',
    //   tabs: [{ title: 'Business Travel Reimbursement', url: 'connect/expense/businesstravelreimbursement', isActive: true }, { title: 'Team Requests', url: 'connect/expense/business-travel-reimbursement-team-requests', isActive: false }],
    //   isTab: true,
    // })
    let tabs = [];
    let isTabActive = true;
    if (_per.hasPermission('Business Travel Reimbursement')) {
      tabs.push({ title: 'Business Travel Reimbursement', url: 'connect/expense/businesstravelreimbursement', isActive: true })
    }
    if (_per.hasPermission('Team Business Travel Reimbursement')) {
      tabs.push({ title: 'Team Requests', url: 'connect/expense/business-travel-reimbursement-team-requests', isActive: false })
    }
    else {
      isTabActive = false;
      this._route.navigateByUrl('connect/expense/businesstravelreimbursement');
    }
    _hS.updateHeaderData({
      title: 'Business Travel Reimbursement',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  ngOnInit() {
    this.getCurrentYearDateFormatted();
    this.getReimbursement();
    this.getRequisition();
  }
  getReimbursement() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      travelStatus: this.ReimbursementStatus,
      sortBy: this.sortBy
    }
    this.spinner.show();

    this._reiS.getReimbursement(data).subscribe((res) => {
      this.spinner.hide();
      this.reimbursementItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.reimbursementItems?.forEach(element => {
        element.createdDate = this.datePipe.transform(element.createdDate, 'MMM dd, yyyy');;
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;
      this.totalExpense = res.totalExpense;
    })

  }
  getRequisition() {
    this.spinner.show();

    this._reiS.getApprovedRequisition().subscribe((res) => {
      this.requisitionItems = res.data;
      this.requisitionItems?.forEach(element => {
        element.createdDate = this.datePipe.transform(element.createdDate, 'MMM dd, yyyy');;
      });
      this.spinner.hide();
    })

  }
  get reimbursementStatusKeys() {
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
    this.ReimbursementStatus = Number(this.statuss[key]);
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
    this.ReimbursementStatus = 0;
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
  applyOffCanvas() {
    this.showOffcanvas = !this.showOffcanvas;
  }
  getReimbursementSummary(id) {
    this._route.navigateByUrl(`/connect/expense/business-travel-reimbursement-summary/${id.travelReimbursementMasterId}`);
  }
  getCreateForm(id) {

    this._route.navigateByUrl(`/connect/expense/create-business-travel-reimbursement/${id}`);
  }
  editReimbursement(id: number) {
    this._route.navigateByUrl(`/connect/expense/update-reimbursement/${id}`);
  }
  deleteReimbursement(id: number) {
    this._reiS.deleteTravelReimbursement(id).subscribe((res) => {
      if (res.statusCode === 200) {
        this.getReimbursement();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Reimbursement Deleted Successfully!" }
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
  exportData() {
    const obj = {
      "startDate": this.startDate,
      "endDate": this.endDate
    };
    this._reiS.getReimbursementReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'ReimbursementDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}
