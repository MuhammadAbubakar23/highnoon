import { Component } from '@angular/core';
import { LeaveStatusService } from '../../services/leave-status.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-leave-status',
  templateUrl: './leave-status.component.html',
  styleUrls: ['./leave-status.component.css']
})
export class LeaveStatusComponent {

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  leaveStatusItems: any = [];
  desColumns = ['name', 'description'];
  columnNames = ['Name', 'Description'];

  constructor(private _leaveStatusS: LeaveStatusService, private _route: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {

    _hS.updateHeaderData({
      title: 'Leave Status',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getLeaveStatus();
  }

  getLeaveStatus() {
    this.spinner.show();
    this._leaveStatusS.getLeaveStatus(this.pageNumber, this.pageSize).subscribe((res) => {
      this.leaveStatusItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getLeaveStatus();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getLeaveStatus();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getLeaveStatus();
    }
  }
  editLeaveStatus(id: number) {
    this._route.navigateByUrl(`/connect/console/update-leave-status/${id}`);
  }
  deleteLeaveStatus(id: any) {
    
    this._leaveStatusS.deleteLeaveStatus(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const leavestatus = this.leaveStatusItems.filter((item: any) => item.leaveStatusId !== id);
        // this.leaveStatusItems = leavestatus;
        this.getLeaveStatus();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Leave Status Deleted Successfully!" }
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
}
