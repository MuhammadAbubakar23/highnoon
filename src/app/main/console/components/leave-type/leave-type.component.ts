import { Component } from '@angular/core';
import { LeaveTypeService } from '../../services/leave-type.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css']
})
export class LeaveTypeComponent {

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = '';
  leaveTypeItems: any = [];
  desColumns = ['name', 'availability', 'description'];
  columnNames = ['Name', 'Availability', 'Description'];

  constructor(private _leaveTS: LeaveTypeService, private _route: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Leave Type',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getLeaveType();
  }

  getLeaveType() {
    this.spinner.show();
    this._leaveTS.getLeaveType(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.leaveTypeItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getLeaveType();
  }
  generalFilter() {
    this.getLeaveType();
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
      this.getLeaveType();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getLeaveType();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getLeaveType();
    }
  }


  editLeaveType(id: number) {
    this._route.navigateByUrl(`/connect/console/update-leave-type/${id}`);
  }
  deleteLeaveType(id: any) {

    this._leaveTS.deleteLeaveType(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const leavetype = this.leaveTypeItems.filter((item: any) => item.leaveTypeId !== id);
        // this.leaveTypeItems = leavetype;
        this.getLeaveType();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Leave Type Deleted Successfully!" }
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
