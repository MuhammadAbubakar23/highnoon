import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-deligation',
  templateUrl: './deligation.component.html',
  styleUrls: ['./deligation.component.css']
})
export class DeligationComponent implements OnInit{
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  deligationItems: any = [
    {employeeId:122333,userName:'Usman',email:'usman10@ibex.co',role:['Agent','Admin','HR','Manager']},
    {employeeId:122334,userName:'Taimoor Khan',email:'Taimoor.khan@ibex.co',role:['Admin']},
    {employeeId:122335,userName:'Kamran Ali',email:'Kamran.ali4@ibex.co',role:['Agent','Admin','Manager']},
  ];
  desColumns = ["employeeId","userName","email","role"];
  columnNames = ['Employee ID','User','Email','Role'];
  constructor(private _r: Router, private _toastS: ToasterService
    , private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Deligation',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

  }
  ngOnInit(): void {

  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;

    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;

    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;

    }
  }
}
