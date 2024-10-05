import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HeaderService } from 'src/app/services/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords=0;
  text = '';
  employeeItems: any = [];
  desColumns = ['title','firstName','lastName'];
  columnNames = ['Title','First Name', 'Last Name'];

  constructor(private _empS: EmployeeService, private _route: Router, private _toastS: ToasterService,
    private _hS:HeaderService,private spinner: NgxSpinnerService)
  {
    _hS.updateHeaderData({
      title: 'Employees',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.spinner.show();
    this._empS.getEmployees(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.employeeItems = res.data;
      this.totalPages=res.totalPages;
      this.totalRecords=res.totalRecords;
      this.spinner.hide();
    })
  }

  resetinput(){
    this.text='';
    this.getEmployees();
  }
  generalFilter() {
    this.getEmployees();
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
     this.getEmployees();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
     this.getEmployees();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
     this.getEmployees();
    }
  }
  editEmployee(id: number) {
    this._route.navigateByUrl(`/connect/console/update-employee/${id}`);
  }
  manageEmployeeRole(id: number) {
    this._route.navigateByUrl(`/connect/console/manage-employee-role/${id}`);
  }
  deleteEmployee(id: any) {

    this._empS.deleteEmployee(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const employees = this.employeeItems.filter((item: any) => item.id !== id);
        // this.employeeItems = employees;
        this.getEmployees();
        const toasterObject = {isShown: true,isSuccess:true, toastHeading: "Deleted", toastParagrahp: "Employee Deleted Successfully!" }
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

