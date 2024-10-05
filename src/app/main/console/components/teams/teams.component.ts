import { Component } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = '';
  teamItems: any = [];
  desColumns = ['teamName'];
  columnNames = ['Name'];

  constructor(private _teamS: TeamService, private _route: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {

    _hS.updateHeaderData({
      title: 'Teams',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getTeams();
  }

  getTeams() {
    this.spinner.show();
    this._teamS.getTeams(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.teamItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }

  resetinput(){
    this.text='';
    this.getTeams();
  }
  generalFilter() {
    this.getTeams();
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
      this.getTeams();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeams();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getTeams();
    }
  }


  manageTeamApproval(id: string) {
    this._route.navigateByUrl(`/connect/console/manage-approval/${id}`);
  }
  editTeam(id: string) {
    this._route.navigateByUrl(`/connect/console/update-team/${id}`);
  }
  deleteTeam(id: any) {

    this._teamS.deleteTeam(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const designations = this. teamItems.filter((item: any) => item.teamId !== id);
        // this. teamItems = designations;
        this.getTeams();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Team Deleted Successfully!" }
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
