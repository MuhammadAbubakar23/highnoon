import { Component } from '@angular/core';
import { JobTitleService } from '../../services/job-title.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-job-title',
  templateUrl: './job-title.component.html',
  styleUrls: ['./job-title.component.css']
})
export class JobTitleComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords=0;
  jobTitleItems: any = [];
  desColumns = ['title'];
  columnNames = ['Title'];
  toastData: any = {};
  constructor(private _jTS: JobTitleService, private _r: Router, private _toastS: ToasterService,
    private _hS: HeaderService,private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Job Title',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getjobTitle();
  }

  getjobTitle() {
    this.spinner.show();
    this._jTS.getJobTitle(this.pageNumber, this.pageSize).subscribe((res) => {
      this.jobTitleItems = res.data;
      this.totalPages=res.totalPages;
      this.totalRecords=res.totalRecords;
      this.spinner.hide();
    })
  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getjobTitle();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getjobTitle();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getjobTitle();
    }
  }
  editobTitle(id: number) {
    this._r.navigateByUrl(`/connect/console/update-job-title/${id}`);
  }
  deleteobTitle(id: any) {
    
    this._jTS.deleteJobTitle(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const jtitle = this.jobTitleItems.filter((item: any) => item.jobTitleId !== id);
        // this.jobTitleItems = jtitle;
        this.getjobTitle();
        const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Deleted", toastParagrahp: "Job Title Deleted Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();

      }
    }, (error: any) => {
      console.error("Internal Server Error", error);
      const toasterObject = { isShown: true,isSuccess:false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })

  }
}

