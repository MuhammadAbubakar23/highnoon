import { Component } from '@angular/core';
import { EmployeeTypeService } from '../../services/employee-type.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employee-type',
  templateUrl: './employee-type.component.html',
  styleUrls: ['./employee-type.component.css']
})
export class EmployeeTypeComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  employeeTypeItems: any = [];
  desColumns = ['typeName'];
  columnNames = ['Name'];
  toastData: any = {};
  constructor(private _empTS: EmployeeTypeService, private _r: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService) {

    _hS.updateHeaderData({
      title: 'Employee Type',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })


  }
  ngOnInit(): void {
    this.getEmployeeType();
  }

  getEmployeeType() {
    this.spinner.show();
    this._empTS.getEmplyeeType(this.pageNumber, this.pageSize).subscribe((res) => {
      this.employeeTypeItems = res.data;
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
      this.getEmployeeType();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getEmployeeType();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getEmployeeType();
    }
  }
  editEmployeeType(id: number) {
    this._r.navigateByUrl(`/connect/console/update-employee-type/${id}`);
  }
  deleteEmployeeType(id: any) {
    
    this._empTS.deleteEmplyeeType(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const employeetype=this.employeeTypeItems.filter((item:any)=>item.employeeTypeId !== id);
        // this.employeeTypeItems=employeetype;
        this.getEmployeeType();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "EmployeeType Deleted Successfully!" }
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
