import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { LeaveUtilizationService } from '../../services/leave-utilization.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Gender } from '../../../../shared/models/statuss';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import * as moment from 'moment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-encashment',
  templateUrl: './encashment.component.html',
  styleUrls: ['./encashment.component.css']
})
export class EncashmentComponent implements OnInit {
  startDate = "";
  endDate = "";
  consfirmationLabel: boolean = false;
  isButtonDisabled = false;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage = 10;
  searchText = "";
  sortBy = "";
  resRemainingLeaves = 0;
  resEncashmentAmount = 0;
  encashmentItems: any = [];
  statuss = Gender;

  desColumns = ['deadLineDate', 'remainingLeaves', 'year', 'payPerLeave', 'overAllTax', 'encashmentAmount', 'status'];
  columnNames = ['Deadline', 'REMAINING LEAVES', 'Year', 'Pay Per Leaves', 'Overall Tax (5%)', 'Encashment Amount', 'Status'];
  currentId = 0;
  leaveUtilizationId = 0;
  year = new Date().getFullYear();
  remainingLeaves = 12;
  payPerLeave = 5000;
  overAllTax = 2500;
  status = 1;
  utilizationType = 1;
  deadLineDate = "";
  encashmentAmount = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  getEnumKeys(enumObject: any): string[] {
    return Object.keys(enumObject).filter(key => isNaN(Number(enumObject[key])));
  }
  getEnumvalue(e) {
    return this.statuss[e]
  }
  constructor(private _hS: HeaderService, private _leaveUS: LeaveUtilizationService, private _toastS: ToasterService,
    private _r: Router, private spinner: NgxSpinnerService, private _per: MenuPermissionService,private datePipe:DatePipe) {

    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Leaves')) {
      tabs.push({ title: 'Leave Encashment', url: 'connect/leaves/encashment', isActive: true })
    }
    if (this._per.hasPermission('Team Leaves')) {
      tabs.push({ title: 'Team Requests', url: 'connect/leaves/encashment/team-requests', isActive: false })
    }
    else {
      isTabActive = false;
    }
    this._hS.updateHeaderData({
      title: 'Leave Encashment',
      tabs: tabs,
      isTab: isTabActive,
    })
  }




  ngOnInit(): void {
    this.deadLineDate = this.getLastDateOfYear();
    this.getCurrentMonthDateFormatted();
    this.getleaveEncashment();

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
  calculateSerialNumber(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getleaveEncashment();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.searchText = "";
    this.getleaveEncashment()
  }
  getleaveEncashment() {
    const data = {
      "pageNumber": this.pageNumber,
      "pageSize": this.pageSize,
      "utilType": this.utilizationType,
      "searchText": this.searchText,
      sortBy: this.sortBy,
    }
    this.spinner.show();

    this._leaveUS.getLeaveUtilization(data).subscribe((res) => {
      console.log("res", res);
      this.encashmentItems = res.pagedReponse.data;
      this.encashmentItems.forEach((item) => {
        if (item.deadLineDate) {
          item.deadLineDate = this.datePipe.transform(item.deadLineDate, 'MMM dd, yyyy');;
        }
        if (item['status'] === 1) {
          item['status'] = "Pending";
        }
        if (item['status'] === 2) {
          item['status'] = "Approved";
        }
        if (item['status'] === 3) {
          item['status'] = "Rejected";
        }

      })
      console.log("itemsPerPage", this.itemsPerPage);
      this.resRemainingLeaves = res.remainingLeaves;
      this.resEncashmentAmount = res.encashmentAmount;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.spinner.hide();

    })

  }
  generalFilter() {
    this.getleaveEncashment();
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

  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getleaveEncashment();
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getleaveEncashment()
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getleaveEncashment()
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getleaveEncashment()
    }
  }


  getEncashmentDetails() {

  }

  get totalEncashmentAmount(): number {
    const totalAmount = this.payPerLeave * this.remainingLeaves
    const percentage = 5
    const totalTax = (totalAmount * percentage) / 100;
    const totalEncashment = totalAmount - totalTax;
    this.encashmentAmount = totalEncashment;
    return totalEncashment;
  }
  getLastDateOfYear(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const lastDateOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
    return lastDateOfYear.toISOString();
  }


  getLeaveSummary(requester, content) {
    this.openEnd(content)
    this._leaveUS.getLeaveUtilRequestSummary(requester.leaveUtilizationId).subscribe(res => {
      this.requesterDetails = {
        "year": res.data.year,
        "requester": res.data.requester,
        "remainingLeaves": res.data.remainingLeaves,
        "payPerLeave": res.data.payPerLeave,
        "overAllTax": res.data.overAllTax,
        "encashmentAmount": res.data.encashmentAmount,
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
  submitForm(content) {
    this.isButtonDisabled = true;

    const data = {
      'leaveUtilizationId': this.leaveUtilizationId,
      'year': String(this.year),
      'remainingLeaves': this.remainingLeaves,
      'payPerLeave': this.payPerLeave,
      'overAllTax': this.overAllTax,
      'status': this.status,
      'utilizationType': this.utilizationType,
      'deadLineDate': this.deadLineDate,
      'EncashmentAmount': this.encashmentAmount
    };
    console.log("data", data)
    this._leaveUS.createLeaveUtilization(data).subscribe((res) => {
      this.isButtonDisabled = false;
      console.log(res)
      if (res.statusCode === 200) {
        this.consfirmationLabel = false;
        this.closeOffset(content)
        this.getleaveEncashment();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Encashment Added Successfully!" }
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
  // editLeaveEncashment(id:any){
  //   this.showOffcanvas = true;
  //   this.currentId=id;
  //   this.getEncashmentDetails();
  // }
  // deleteLeaveEncashment(id: any) {
  //
  //   this._leaveUS.deleteLeaveUtilization(id).subscribe((res) => {
  //     if (res.statusCode === 200) {
  //       const encashment = this.encashmentItems.filter((item: any) => item.leaveId !== id);
  //       const toasterObject = { isShown: true, toastHeading: "Deleted", toastParagrahp: "Encashment Deleted Successfully!" }
  //       this._toastS.updateToastData(toasterObject)
  //       setTimeout(() => {
  //         const toasterObject = { isShown: false, toastHeading: "", toastParagrahp: "" }
  //         this._toastS.updateToastData(toasterObject)
  //       }, 3000);
  //       this.encashmentItems = encashment;
  //     }
  //   },
  //     (error: any) => {
  //       console.error("Login error:", error);
  //     });
  // }
  showConsfirmationLabel() {
    this.consfirmationLabel = true;
  }
  cancelConsfirmationLabel() {
    this.consfirmationLabel = false;
  }


  exportData() {

    const obj = {
      "utilType": this.utilizationType,
      "searchText": this.searchText
    }

    this._leaveUS.getLeaveUtilizationReport(obj).subscribe((res: any) => {
      const a = document.createElement('a');
      a.href = res;
      a.download = 'EncashmentDataReport' + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
