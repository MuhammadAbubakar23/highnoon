import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { SchedularService } from '../../services/schedular.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import * as moment from 'moment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedular-requests',
  templateUrl: './schedular-requests.component.html',
  styleUrls: ['./schedular-requests.component.css']
})
export class SchedularRequestsComponent implements OnInit {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  searchText = "";
  startDate = "";
  endDate = "";
  sortBy = "";
  scheduleRequestItems: any = [];
  plannedOverTime = 0;
  regularHours = 0;
  allHours = 0;
  todayBreakTime = 0;
  todayOverTime = 0;
  todayTotalHours = 0;
  requesterDetails: any = {};
  requestStages: any = [];
  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  desColumns = ['scheduleDate', 'shiftStart', 'shiftEnd', 'breakStart', 'breakEnd', 'overTimeHours', 'status'];
  columnNames = ['Date', 'Check-In', 'Check-Out', 'Break In', 'Break End', 'Overtime','Status'];

  sortingColumns = ["UserName","DateTime","CheckIn","CheckOut","BreakIn","BreakOut","Status"]
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _schedule: SchedularService, private spinner: NgxSpinnerService,
    private _dDFS: DateTimeFormatService, private _per: MenuPermissionService) {
    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Schedular')) {
      tabs.push({ title: 'My Roster', url: 'connect/attendance/roster', isActive: false }, { title: 'My Requests', url: 'connect/attendance/roster/my-requests', isActive: true })
    }
    // if (this._per.hasPermission('Team Requests Schedular')) {
    //   tabs.push({ title: 'Team Requests', url: 'connect/attendance/schedular/team-requests', isActive: false })
    // }
    if (this._per.hasPermission('Team Schedular')) {
      tabs.push({ title: 'Team Roster', url: 'connect/attendance/team-roster', isActive: false }, { title: 'Team Requests', url: 'connect/attendance/roster/team-requests', isActive: false })
    }
    this._hS.updateHeaderData({
      title: 'Roster',
      tabs: tabs,
      isTab: isTabActive,
    })
  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getMyRequests();
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

  getMyRequests() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.searchText,
      startDate: this.startDate,
      endDate: this.endDate,
      sortBy: this.sortBy
    }
    console.log("data", data)

    this._schedule.getmyRequestSchedule(data).subscribe((res) => {
      this.plannedOverTime = res.plannedOverTime;
      this.regularHours = res.regularHours;
      this.allHours = res.allHours;
      if (res.todayBreak === null) {
        res.todayBreak = 0
      }
      if (res.todayTotalHours === null) {
        res.todayTotalHours = 0;
      }
      this.todayBreakTime = res.todayBreak;
      this.todayOverTime = res.todayOverTime;
      this.todayTotalHours = res.todayTotalHours;
      this.scheduleRequestItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.scheduleRequestItems.forEach((item)=>{
        if(item.scheduleDate){
          item.scheduleDate=this.datePipe.transform(item.scheduleDate,"yyyy-MM-dd")
        }
      })
    })
  }
  resetEndDate() {
    this.endDate = '';
  }
  filterByDate() {
    if (this.endDate >= this.startDate) {

      console.log("filterByDate", this.startDate, this.endDate)
      this.getMyRequests();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.searchText = "";
    this.getCurrentMonthDateFormatted();
    this.sortBy = "";
    this.getMyRequests();
  }
  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getMyRequests();
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
      this.getMyRequests();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getMyRequests();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getMyRequests();
    }
  }
  get isAllPending() {
    return this.requestStages.some((item) => item.status !== 1)
  }

  getRequestSummary(requester, content) {
    this.openEnd(content)
    this._schedule.getScheduleRequestSummary(requester.scheduleRequestId).subscribe(res => {
      this.requesterDetails = {
        scheduleDate: moment(res.data.scheduleDate).format("MMM D, YYYY h:mm A"),
        overTimeHours: this._dDFS.secondsToHHMM(res.data.overTimeHours),
        requester: res.data.requester,
        appliedDate:   this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        notes: res.data.notes,

      }
      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =   this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate =   this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
      console.log("requestStages", this.requestStages)
    })
  }
  exportData() {

    const obj = {
      startDate: this.startDate,
      endDate: this.endDate,
      text: this.searchText,
      sortBy: this.sortBy
    }
    this._schedule.getScheduleReport(obj).subscribe((res: any) => {
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'RosterDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }
}

