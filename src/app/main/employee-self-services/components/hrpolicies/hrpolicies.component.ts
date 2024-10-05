import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HRPolicyService } from 'src/app/main/console/services/hr-policy.service';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hrpolicies',
  templateUrl: './hrpolicies.component.html',
  styleUrls: ['./hrpolicies.component.css']
})

export class HrpoliciesComponent implements OnInit {
  @Input() isTabs: boolean = true;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = "";
  policyItems: any = [];
  startDate = "";
  endDate = "";
  imageBaseUrl = environment.imageBaseUrl;
  columnNames = ['Name', 'LAST MODIFIED'];
  constructor(private _hS: HeaderService, private _toastS: ToasterService, private spinner: NgxSpinnerService, private _route: Router, private _policyS: HRPolicyService,
    private _per: MenuPermissionService, private datePipe: DatePipe) {
    this.initInspectElementBlocker();
  }



  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event): void {
    event.preventDefault();
  }

  @HostListener('copy', ['$event'])
  onCopy(event: Event): void {
    event.preventDefault();
  }
  private initInspectElementBlocker(): void {
    window.addEventListener('keydown', (event) => {
      if (event.keyCode === 123) { // F12 key
        event.preventDefault();
      }
    });
  }
  ngOnInit(): void {

    if (this.isTabs === true) {
      let tabs = [];
      let isTabActive = true;
      if (this._per.hasPermission('HR Policies')) {
        tabs.push({ title: 'Articles', url: 'connect/employee-self-services/hr-articles', isActive: false }, { title: 'Policies', url: 'connect/employee-self-services/hr-policies', isActive: true })
      }
      else {
        this._route.navigateByUrl('/connect/dashborad/my-dashboard');
      }

      this._hS.updateHeaderData({
        title: 'HR Policies',
        tabs: tabs,
        isTab: isTabActive,
      })
    }
    this.getCurrentMonthDateFormatted();
    this.getPolicies();
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
  // generalFilter() {

  // }

  getPolicies() {
    this.spinner.show();
    this._policyS.getPolicyDocuments(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      res.data.forEach(element => {
        if (element.modifiedDate === null) {
          element.modifiedDate = element.createdDate
        }

      });
      this.policyItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput() {
    this.text = '';
    this.getPolicies();
  }
  generalFilter() {
    this.getPolicies();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getPolicies();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
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
      this.getPolicies();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getPolicies();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getPolicies();
    }
  }

  editPolicy(id: number) {
    this._route.navigateByUrl(`/connect/console/update-policies-documents/${id}`);
  }
  deletePolicy(id: any) {

    this._policyS.deletePolicyDocuments(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const locations = this. policyItems.filter((item: any) => item.locationId !== id);
        // this. policyItems = locations;
        this.getPolicies();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Policy Documents Deleted Successfully!" }
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
