import { Component } from '@angular/core';
import { WorkFlowService } from '../../services/work-flow.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.css']
})
export class WorkFlowComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = '';
  workFlowItems: any = [];
  desColumns = ['name'];
  columnNames = ['Name'];
  toastData: any = {};
  constructor(private _wFS: WorkFlowService, private _r: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'workflows',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

  }
  ngOnInit(): void {
    this.getWorkFlows();
  }

  getWorkFlows() {
    this.spinner.show();
    this._wFS.getWorkFlows(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.workFlowItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getWorkFlows();
  }
  generalFilter() {
    this.getWorkFlows();
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
      this.getWorkFlows();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getWorkFlows();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getWorkFlows();
    }
  }


  editWorkFlow(id: number) {
    this._r.navigateByUrl(`/connect/console/update-workflow/${id}`);
  }
  deleteWorkFlow(id: any) {
    
    this._wFS.deleteWorkFlow(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const workflows = this.workFlowItems.filter((item: any) => item.workFlowId !== id);
        // this.workFlowItems = workflows;
        this.getWorkFlows();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Workflow Deleted Successfully!" }
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

