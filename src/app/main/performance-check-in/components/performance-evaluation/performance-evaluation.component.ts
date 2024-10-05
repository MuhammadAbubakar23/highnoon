import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-performance-evaluation',
  templateUrl: './performance-evaluation.component.html',
  styleUrls: ['./performance-evaluation.component.css']
})
export class PerformanceEvaluationComponent implements OnInit{
  performanceItems: any = [{date: "May 18, 2023", name : "Annual Perfomance Appraisal", status : "Pending"},{date: "May 18, 2023", name : "Q2 2023 performance appraisal", status : "Rejected"},{date: "May 18, 2023", name : "Training Program knowledge", status : "Approved"},{date: "May 18, 2023", name : "Bi-Annual Perfomance Evaluation", status : "Canceled"}];
  desColumns = ["date", "name", "status"];
  columnNames = ['Date', 'Type', 'Status'];
  pageNumber = 1;
  showOffcanvas: boolean = false;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  constructor(private _hS: HeaderService){

  }
   ngOnInit(): void {
    let tabs = [];
    tabs.push({ title: 'Performance Evaluation', url: 'connect/performance-check-in', isActive: true })
    this._hS.updateHeaderData({
      title: 'Performance Evaluation',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
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
