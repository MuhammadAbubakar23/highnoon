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
import { Router } from '@angular/router';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-provident-fund-team-requests',
  templateUrl: './provident-fund-team-requests.component.html',
  styleUrls: ['./provident-fund-team-requests.component.css']
})
export class ProvidentFundTeamRequestsComponent {
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
  currentDate = new Date();
  selectedProvidentStatus = "";
  providentStatuss = Status;
  providentStatus = 0;
  sortBy = "";
  providentTeamItems: any = [];
  desColumns = ["pfDate", "userName", "pfType", "status"];
  columnNames = ['Date', 'Requester', 'Provident Fund Type', 'Status'];
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
  constructor(private _hS: HeaderService, private _pF: ProvidentFundService, private _toastS: ToasterService, private _dropdownS: DropDownApiService
    , private datePipe: DatePipe, private spinner: NgxSpinnerService, private _per: MenuPermissionService, private _route: Router) {
    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Provident Fund')) {
      tabs.push({ title: 'Provident Fund', url: 'connect/employee-self-services/provident-fund', isActive: false })
    }
    if (this._per.hasPermission('Team Provident Fund')) {
      tabs.push({ title: 'Team Requests', url: 'connect/employee-self-services/provident-fund/team-requests', isActive: true })
    }
    else {
      isTabActive = false;
      this._route.navigateByUrl('/connect/employee-self-services/provident-fund');
    }
    this._hS.updateHeaderData({
      title: 'Provident Fund',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  ngOnInit(): void {
    this.getCurrentYearDateFormatted();
    this.getTeamProvident();
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
      this.getTeamProvident();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeamProvident();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getTeamProvident();
    }
  }

  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getTeamProvident();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  getTeamProvident() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.providentStatus,
      sortBy: this.sortBy
    }
    //this.spinner.show();

    this._pF.getAllTeamProvident(data).subscribe((res) => {
      this.providentTeamItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.providentTeamItems.forEach(element => {
        element.pfDate = moment(element.pfDate).format("MMM D, YYYY h:mm A");;
        if (element.status === 1) {
          element.status = 'Pending';
          this.pending = this.pending + 1;
        }
        if (element.status === 2) {
          element.status = 'Approved';
          this.approved = this.approved + 1;
        }
        if (element.status === 3) {
          element.status = 'Rejected';
          this.rejected = this.rejected + 1;
        }
        if (element.pfType === 1) {
          element.pfType = 'WithDraw';
        }
        if (element.pfType === 2) {
          element.pfType = 'Deposit';
        }
      });
      console.log("providentTeamItems", this.providentTeamItems.length)
      // this.approved = res.pagedReponse.approved;
      // this.pending = res.pagedReponse.pending;
      // this.rejected = res.pagedReponse.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;

      this.spinner.hide();

    })

  }

  // sortDataBy(columnName) {
  //   this.sortBy = columnName;
  //   this.getTeamProvident();
  // }
  generalFilter() {
    this.getTeamProvident();
  }

  get providentStatusKeys() {
    const keys = Object.keys(this.providentStatuss);
    return keys
  }
  filterByStatus(key: any) {

    this.providentStatus = Number(this.providentStatuss[key]);
    this.selectedProvidentStatus = key;
    this.getTeamProvident();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();
    this.providentStatus = 0;
    this.selectedProvidentStatus = "Status";
    this.sortBy = "";
    this.getTeamProvident();
  }


  updateRequest(reqstageId: number, statusId: number, content) {
    // this.summaryToggle = false;

    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._pF.updateRequestStage(data).subscribe((res) => {
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
        this.getTeamProvident();
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
    this._pF.getTeamProvidentReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'TeamProvidentFundDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
  getProvidentSummary(requester, content) {
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
    this._pF.getProvidentRequestSummary(requester.pfRequestId).subscribe(res => {

      this.requesterDetails = {
        "pfDate": this.datePipe.transform(res.data.pfDate, 'MMM dd, yyyy'),
        "amount": res.data.amount,
        "limit": res.data.limit,
        "remaining": res.data.remaining,
        "notes": res.data.notes,
        "requester": res.data.requester,
        "appliedAt": this.datePipe.transform(res.data.appliedAt, 'MMM dd, yyyy'),
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


}
