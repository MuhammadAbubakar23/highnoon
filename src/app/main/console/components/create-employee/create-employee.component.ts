import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { EmployeeService } from '../../services/employee.service';
import { Address, BankDetails, Employee, Genders, MaritalStatus } from '../../models/employee';
import { HeaderService } from 'src/app/services/header.service';

import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  currentId: any = 0;
  genders = Genders;
  martialStatus = MaritalStatus;
  employeeTypes: any = [];
  designations: any = [];
  teams: any = [];
  jobTitles: any = [];
  managers: any = [];
  cities: any = [];
  employee = new Employee();
  address = new Address();
  bankDetails = new BankDetails();
  isDetails: boolean = true;
  isAddress: boolean = false;
  isBank: boolean = false;
  file: File
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  // employeeForm :FormGroup
  getEnumKeys(enumObject: any): string[] {
    return Object.keys(enumObject).filter(key => isNaN(Number(enumObject[key])));
  }


  employeeForm = new FormGroup({
    id: new FormControl(this.employee.id),
    employeeId: new FormControl(this.employee.employeeId),
    title: new FormControl(this.employee.title, [Validators.maxLength(10)]),
    firstName: new FormControl(this.employee.firstName, [Validators.required, Validators.maxLength(100)]),
    userName: new FormControl(this.employee.userName, [Validators.required, Validators.maxLength(100)]),
    password: new FormControl(this.employee.password, [Validators.required, Validators.maxLength(100)]),
    lastName: new FormControl(this.employee.lastName, [Validators.required, Validators.maxLength(100)]),
    email: new FormControl(this.employee.email, [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
    phone: new FormControl(this.employee.phone, [Validators.maxLength(50)]),

    gender: new FormControl(this.employee.gender),
    martialStatus: new FormControl(this.employee.martialStatus),
    birthDate: new FormControl(this.employee.birthDate),
    cnic: new FormControl(this.employee.cnic),
    cnicExpiry: new FormControl(this.employee.cnicExpiry),
    joinigDate: new FormControl(this.employee.joinigDate),
    hiringDate: new FormControl(this.employee.hiringDate),
    alternateEmail: new FormControl(this.employee.alternateEmail, [Validators.maxLength(200), Validators.email, Validators.pattern(this.emailPattern)]),
    employeeTypeId: new FormControl(this.employee.employeeTypeId),
    designationId: new FormControl(this.employee.designationId),
    teamId: new FormControl(this.employee.teamId),
    jobTitleId: new FormControl(this.employee.jobTitleId),
    managerId: new FormControl(this.employee.managerId),
    address: new FormGroup({
      id: new FormControl(this.address.id),
      curentAddress: new FormControl(this.address.curentAddress, [Validators.maxLength(200)]),
      addressType: new FormControl(this.address.addressType, [Validators.maxLength(50)]),
      cityId: new FormControl(this.address.cityId, [Validators.required]),
    }),
    bankDetails: new FormGroup({
      id: new FormControl(this.bankDetails.id),
      banklName: new FormControl(this.bankDetails.banklName, [Validators.maxLength(200)]),
      branchName: new FormControl(this.bankDetails.branchName, [Validators.maxLength(200)]),
      accountNumber: new FormControl(this.bankDetails.accountNumber, [Validators.maxLength(100)]),
      ibanNumber: new FormControl(this.bankDetails.ibanNumber, [Validators.maxLength(100)]),
    })
  });
  Object: any;


  constructor(private _empS: EmployeeService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private _DDS: DropDownApiService, private _dDFS: DateTimeFormatService, private datePipe: DatePipe) {
    this.changeHeader('create');
  }
  ngOnInit(): void {

    this.employeeForm.get('employeeId').setValue(Number(localStorage.getItem('userId')));
    console.log("employeeId", this.employeeForm.value);
    this.getEmployeeDetails();
  }
check(){
  
  console.log("this.employeeForm.value",this.employeeForm.value);
}
  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Employees',
        tabs: [{ title: 'Create', url: 'connect/console/create-employee', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Employees',
        tabs: [{ title: 'update', url: 'connect/console/update-employee', isActive: true }],
        isTab: false,
      })
    }
  }
  getEmployeeDetails() {
    
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      console.log("Current Id",this.currentId);
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update');
        this.employeeForm.get('userName').setValidators(null);
        this.employeeForm.get('password').setValidators(null);
        this._empS.getEmployeeById(this.currentId).subscribe((res) => {
          console.log(res);
          const parsedbirthDate = new Date(res.data.birthDate);
          res.data.birthDate = this.datePipe.transform(parsedbirthDate, 'yyyy-MM-dd');
          const parsedcnicExpiry = new Date(res.data.cnicExpiry);
          res.data.cnicExpiry = this.datePipe.transform(parsedcnicExpiry, 'yyyy-MM-dd');

          const parsedjoinigDate = new Date(res.data.joinigDate);
          res.data.joinigDate = this.datePipe.transform(parsedjoinigDate, 'yyyy-MM-dd');

          const parsedhiringDate = new Date(res.data.hiringDate);
          res.data.hiringDate = this.datePipe.transform(parsedhiringDate, 'yyyy-MM-dd');
          this.employeeForm.patchValue(res.data);
        })
      }

      this._DDS.getEmployeeTypeForDD().subscribe((res) => {
        this.employeeTypes = res.data;
      })
      this._DDS.getDesignationForDD().subscribe((res) => {
        this.designations = res.data;
      })
      this._DDS.getTeamsForDD().subscribe((res) => {
        this.teams = res.data;

      })
      this._DDS.getJobTitleForDD().subscribe((res) => {
        this.jobTitles = res.data;
      })
      this._DDS.getEmployeesForDD().subscribe((res) => {
        this.managers = res.data;
      })
      this._DDS.getCitiesForDD().subscribe((res) => {
        
        this.cities = res.data;
      })
    }
    )
  }
  changeTabs(tab: string) {
    
    if (tab === "details") {
      this.isDetails = true;
      this.isAddress = false;
      this.isBank = false;;
    }
    if (tab === "address") {
      this.isAddress = true;
      this.isDetails = false;
      this.isBank = false;;
    }

    if (tab === "bank") {
      this.isBank = true;
      this.isDetails = false;
      this.isAddress = false;
    }


  }
  get eF() {
    return this.employeeForm.controls
  }
  onFileSelected(event: any): void {
    this.file = event.target.files[0];

  }
  submitForm() {
    

    if (this.employeeForm.value.address?.curentAddress === "") {
      this.employeeForm.value.address = null;
    }
    if (this.employeeForm.value.bankDetails?.banklName === "" || this.employeeForm.value.bankDetails.accountNumber === "") {
      this.employeeForm.value.bankDetails = null;
    }
    if (this.currentId !== 0 && this.currentId !== undefined) {
      // const formData = new FormData();
      // formData.append('image', this.file, this.file.name);
      const data = this.employeeForm.value;
      // formData.append('modelData', JSON.stringify(this.employeeForm.value))
      // console.log("formData", formData);
      this._empS.updateEmployee(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Employee Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/employees']);
          this._toastS.hide();
        }

      }, (error: any) => {
        console.error("Internal Server Error", error);
        const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      })

    }
    else {
      console.log(this.employeeForm.value);

      const data = this.employeeForm.value;
      
      // const formData = new FormData();
      // formData.append('image', this.file, this.file.name);

      // formData.append('modelData', JSON.stringify(this.employeeForm.value))
      // console.log("formData", formData);
      this._empS.createEmployee(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Employee Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/employees']);
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


}

