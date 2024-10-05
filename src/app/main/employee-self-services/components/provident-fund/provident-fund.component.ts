import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { ProvidentFundService } from '../../services/provident-fund.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { Status } from 'src/app/shared/models/statuss';
import * as moment from 'moment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-provident-fund',
  templateUrl: './provident-fund.component.html',
  styleUrls: ['./provident-fund.component.css']
})
export class ProvidentFundComponent implements OnInit {
  providentItems: any = [];
  desColumns = ["pfDate", "pfType", "pfAmountWithDraw", "status"];
  columnNames = ['Date', 'Provident Fund Type', 'Amount', 'Status'];
  statuss = Status;

  pfTotalBal = 0;
  pfWithDraw = 0;
  pfEmployee = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  text = "";
  startDate = "";
  endDate = "";
  providentStatus = 0;
  selectedProvidentStatus = "";
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  showOffcanvas: boolean = false;
  requesterDetails: any = {};
  requestStages: any = [];
  isButtonDisabled = false;
  providentForm = new FormGroup({
    providentFundId: new FormControl(0),
    userId: new FormControl(0),
    pfDate: new FormControl('', [Validators.required]),
    pfType: new FormControl(1),
    pfAmountDeposit: new FormControl(0),
    pfAmountWithDraw: new FormControl(null, [Validators.required]),
    pfWithDrawLimit: new FormControl(0, [Validators.required]),
    status: new FormControl(1),
    notes: new FormControl('', [Validators.required, Validators.maxLength(200)])
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
  get pF() {
    return this.providentForm.controls
  }

  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _per: MenuPermissionService, private _pFS: ProvidentFundService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService) {
    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Provident Fund')) {
      tabs.push({ title: 'Provident Fund', url: 'connect/employee-self-services/provident-fund', isActive: true })
    }
    if (this._per.hasPermission('Team Provident Fund')) {
      tabs.push({ title: 'Team Requests', url: 'connect/employee-self-services/provident-fund/team-requests', isActive: false })
    }
    else {
      isTabActive = false;
    }
    this._hS.updateHeaderData({
      title: 'Provident Fund',
      tabs: tabs,
      isTab: isTabActive,
    })

  }

  ngOnInit(): void {
    this.getCurrentYearDateFormatted();
    this.getProvident();
    this._pFS.getPFStats({ "startDate": "2024-03-01", "endDate": "2024-03-30" }).subscribe((res) => {
      this.pfTotalBal = res.data[0].pfTotalBal;
      this.pfWithDraw = res.data[0].pfWithDraw;
      this.pfEmployee = res.data[0].pfEmployee;
    });
  }

  getProvident() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.providentStatus,
      sortBy: this.sortBy
    }
    this.spinner.show();

    this._pFS.getProvident(data).subscribe((res) => {
      this.spinner.hide();
      this.providentItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.providentItems.forEach(element => {
        element.pfDate = moment(element.pfDate).format("MMM D, YYYY");;
        if (element.status === 1) {
          element.status = 'Pending';
        }
        if (element.status === 2) {
          element.status = 'Approved';
        }
        if (element.status === 3) {
          element.status = 'Rejected';
        }
        if (element.pfType === 1) {
          element.pfType = 'PF Withdrawal';
        }
        if (element.pfType === 2) {
          element.pfType = 'Deposit';
        }
      });



    })

  }
  get providentStatusKeys() {
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
    this.getProvident();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getProvident();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }

  filterByStatus(key: any) {

    this.providentStatus = Number(this.statuss[key]);
    this.selectedProvidentStatus = key;

    this.getProvident();
  }

  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getProvident();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentYearDateFormatted();
    this.selectedProvidentStatus = "Status";
    this.providentStatus = 0;
    this.sortBy = "";
    this.getProvident();
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
      this.getProvident();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getProvident();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getProvident();
    }
  }

  getProvidentDetails() {
    this._pFS.getProvidentById(this.currentId).subscribe((res) => {
      const parsedpfDate = new Date(res.data.pfDate);
      res.data.pfDate = this.datePipe.transform(parsedpfDate, 'yyyy-MM-dd');
      this.providentForm.patchValue({
        providentFundId: res.data.providentFundId,
        userId: res.data.userId,
        pfDate: res.data.pfDate,
        pfType: res.data.pfType,
        pfAmountDeposit: res.data.pfAmountDeposit,
        pfAmountWithDraw: res.data.pfAmountWithDraw,
        pfWithDrawLimit: res.data.pfWithDrawLimit,
        status: res.data.status,
        notes: res.data.notes
      })
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
  submitForm(content) {
    if (this.providentForm.valid) {
      this.isButtonDisabled = true;
      this.providentForm.get('userId').setValue(Number(localStorage.getItem('userId')))
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.providentForm.get('providentFundId').setValue(this.currentId);
        const data = this.providentForm.value;
        this._pFS.updateProvident(data).subscribe((res) => {
          this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "PF Updated Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
            this.getProvident();
          }

        }, (error: any) => {
          this.closeOffset(content);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
      else {

        const data = this.providentForm.value;
        this._pFS.createProvident(data).subscribe((res) => {
          if (res.statusCode === 200) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Request sent successfully", toastParagrahp: "Your Provident Fund Request has been sent for approval." }
            this._toastS.updateToastData(toasterObject)
            this._toastS.hide();
            this.getProvident();
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
      this.markFormGroupTouched(this.providentForm);
    }

  }

  resetForm() {
    // this.showOffcanvas = !this.showOffcanvas;
    this.providentForm.reset(
      {
        providentFundId: 0,
        userId: 0,
        pfDate: '',
        pfType: 1,
        pfAmountDeposit: 0,
        pfAmountWithDraw: null,
        pfWithDrawLimit: 0,
        status: 1,
        notes: ''
      })
  }

  editProvident(id: any) {
    this.currentId = id;
    this.getProvidentDetails();
  }
  deleteProvident(id: any) {
    this._pFS.deleteProvident(id).subscribe((res) => {
      if (res.statusCode === 200) {
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Request deleted successfully", toastParagrahp: "Your Provident Fund request has been deleted." }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
        this.getProvident();
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
    this._pFS.getProvidentReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'ProvidentFundDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
  get isAllPending() {
    return this.requestStages.some((item) => item.status !== 1)
  }
  getProvidentSummary(requester) {
    this._pFS.getProvidentRequestSummary(requester.pfRequestId).subscribe(res => {

      this.requesterDetails = {
        "pfDate":   this.datePipe.transform(res.data.pfDate, 'MMM dd, yyyy'),
        "amount": res.data.amount,
        "status": res.data.status,
        "limit": -1100,
        "remaining": res.data.limit,
        "notes": res.data.notes,
        "requester": res.data.requester,
        "appliedAt":   this.datePipe.transform(res.data.appliedAt, 'MMM dd, yyyy'),
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

