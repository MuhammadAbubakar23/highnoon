import { DatePipe } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status } from 'src/app/shared/models/statuss';
import { LeavesService } from 'src/app/main/leaves/services/leaves.service';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { BenefitsService } from '../../services/benefits.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-benefits-team-requests',
  templateUrl: './benefits-team-requests.component.html',
  styleUrls: ['./benefits-team-requests.component.css']
})
export class BenefitsTeamRequestsComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage = 10;
  text = "";
  startDate = "";
  endDate = "";
  isActive = false;
  status: any;
  currentDate = new Date();
  selectedBenefitStatus = "";
  benefitStatuss = Status;
  benefitStatus = 0;
  sortBy = "";
  benefitsTeamItems: any = [];
  desColumns = ['benefitDate', 'benefitType', 'status'];
  columnNames = ['Date', 'Type', 'Status'];
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  totalRequest: number = 0;
  requesterDetails: any = {};
  summaryItem: any = {};
  requestStages: any = [];
  summaryAttachments: any[] = [];
  currentRequestStageId = 0;
  showVehicleRequest = false;
  showInterestFreeLoan = false;
  showMobilePackage = false;
  showAllowanceRequest = false;
  showInternetDevice = false;
  showApplyFuelCard = false;
  showSubsidizedMedicine = false;
  vehicleRequestForm: FormGroup = new FormGroup({
    VehicleRequestId: new FormControl(0, [Validators.required]),
    DriverRequired: new FormControl(true, [Validators.required]),
    TravelType: new FormControl('Intra City', [Validators.required]),
    DrivingLicense: new FormControl(true, [Validators.required]),
    LicenseNumber: new FormControl('', [Validators.required]),
    RequiredFrom: new FormControl(null, [Validators.required]),
    RequiredTo: new FormControl(null, [Validators.required]),
  });

  interestFreeLoanForm = new FormGroup({
    InterestFreeLoanId: new FormControl(0, [Validators.required]),
    AmountRequired: new FormControl(null, [Validators.required, Validators.min(0)]),
    TimePeriod: new FormControl(null, Validators.required),
  });
  mobilePackageForm = new FormGroup({
    MobilePackageId: new FormControl(0, [Validators.required]),
    EligibleForAllowance: new FormControl(true, Validators.required),
  });

  mobileAllowanceForm = new FormGroup({
    MobileAllowanceId: new FormControl(0, [Validators.required]),
    TopupRequiredCurrentMonth: new FormControl(true, Validators.required),

  });
  //array

  internetDeviceForm = new FormGroup({
    InternetDeviceId: new FormControl(0, [Validators.required]),
    DeviceType: new FormControl('', Validators.required),
    Preference1: new FormControl('', Validators.required),
    Preference2: new FormControl('', Validators.required),
  });
  createFuelCardControl(): FormGroup {
    return this.fb.group({
      FuelCardId: new FormControl(0, [Validators.required]),
      Date: new FormControl(null, Validators.required),
      PurchasedLiters: new FormControl(null, [Validators.required]),
      AmountPerLiter: new FormControl(null, [Validators.required]),
      Total: new FormControl(null, [Validators.required]),
    })
  }
  fuelCardForm = this.fb.array([this.createFuelCardControl()]);

  designationSubsidyForm = this.fb.array([]);
  requestForm: FormGroup = new FormGroup({
    BenefitId: new FormControl(0),
    BenefitDate: new FormControl(''),
    Notes: new FormControl(''),
    Status: new FormControl(1),
    BenefitTypeId: new FormControl(0),
    BenefitType: new FormControl(''),
    UserId: new FormControl(localStorage.getItem('userId')),
    BenefitTypeForm: new FormGroup({}),
    Files: this.fb.array([])
  })
  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
        Validators.maxLength(200)])
    }
  )
  get rF() {
    return this.teamRequestForm.controls;
  }
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
  }
  // summaryToggle: boolean = false;
  // toggleSummary() {
  //   this.summaryToggle = !this.summaryToggle
  // }
  constructor(private _hS: HeaderService, private _beneFitS: BenefitsService, private _toastS: ToasterService,
    private datePipe: DatePipe, private spinner: NgxSpinnerService, private fb: FormBuilder, private _per: MenuPermissionService, private _route: Router) {

    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Benefits')) {
      tabs.push({ title: 'Benefits', url: 'connect/employee-self-services/benefits', isActive: false })
    }
    if (this._per.hasPermission('Team Benefits')) {
      tabs.push({ title: 'Team Requests', url: 'connect/employee-self-services/benefits/team-requests', isActive: true })
    }
    else {
      isTabActive = false;
      this._route.navigateByUrl('/connect/employee-self-services/benefits');
    }
    this._hS.updateHeaderData({
      title: 'Benefits',
      tabs: tabs,
      isTab: isTabActive,
    })

  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getTeamBenefits();
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

  calculateSerialNumber(index: number): number {
    return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
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
      this.getTeamBenefits();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getTeamBenefits();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getTeamBenefits();
    }
  }

  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getTeamBenefits();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }
  getTeamBenefits() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.benefitStatus,
      sortBy: this.sortBy
    }
    //this.spinner.show();

    this._beneFitS.getAllTeamBenefits(data).subscribe((res) => {
      this.benefitsTeamItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.benefitsTeamItems.forEach(element => {
        element.benefitDate =   this.datePipe.transform(element.benefitDate, 'MMM dd, yyyy');
        if (element.status === 1) {
          element.status = 'Pending';
        }
        if (element.status === 2) {
          element.status = 'Approved';
        }
        if (element.status === 3) {
          element.status = 'Rejected';
        }
        if (element.status === 4) {
          element.status = 'Canceled';
        }
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;

      this.spinner.hide();

    })

  }
  generalFilter() {
    this.getTeamBenefits();
  }

  get benefitStatusKeys() {
    const keys = Object.keys(this.benefitStatuss);
    return keys
  }
  filterByStatus(key: any) {

    this.benefitStatus = Number(this.benefitStatuss[key]);
    this.selectedBenefitStatus = key;
    this.getTeamBenefits();
  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentMonthDateFormatted();
    this.benefitStatus = 0;
    this.selectedBenefitStatus = "Status";
    this.sortBy = "";
    this.getTeamBenefits();
  }

  get sMF(): FormArray {
    return this.requestForm.get('BenefitTypeForm') as FormArray;
  }
  updateRequest(reqstageId: number, statusId: number, content) {
    // this.summaryToggle = false;

    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._beneFitS.updateRequestStage(data).subscribe((res) => {
      this.closeOffset(content);

      if (res.statusCode === 200) {
        let message = ""
        let heading = ""
        if (statusId === 2) {
          message = "You have successfully approved the request."
          heading = "Request approved successfully"
        }
        if (statusId === 3) {
          message = "You have successfully rejected the request."
          heading = "Request rejected successfully"
        }
        if (statusId == 5){
          message = "The request is On-Hold now."
          heading = "Request on hold successfully"
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: heading, toastParagrahp: message }
        this.getTeamBenefits();
        this._toastS.updateToastData(toasterObject);
        this._toastS.hide();
      }
      if (res.statusCode === 404) {

        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Failed", toastParagrahp: res.data }
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
  updateRequestStageId(id: number) {
    this.currentRequestStageId = id;
    this.teamRequestForm.reset();
  }

  checkBenefitType(type: string) {
    const selectedText = type.trim();
    this.requestForm.get('BenefitType').setValue(selectedText)
    this.showVehicleRequest = selectedText === 'Official Vehicle Request';
    if (this.showVehicleRequest) {
      this.requestForm.setControl('BenefitTypeForm', this.vehicleRequestForm);
    }
    this.showInterestFreeLoan = selectedText === 'Employee Interest Free Loan';
    if (this.showInterestFreeLoan) {
      this.requestForm.setControl('BenefitTypeForm', this.interestFreeLoanForm);
    }
    this.showMobilePackage = selectedText === 'Official Mobile Package';
    if (this.showMobilePackage) {
      this.requestForm.setControl('BenefitTypeForm', this.mobilePackageForm);
    }
    this.showAllowanceRequest = selectedText === 'Mobile Allowance Request';
    if (this.showAllowanceRequest) {
      this.requestForm.setControl('BenefitTypeForm', this.mobileAllowanceForm);
    }
    this.showInternetDevice = selectedText === 'Internet Device';
    if (this.showInternetDevice) {
      this.requestForm.setControl('BenefitTypeForm', this.internetDeviceForm);
    }
    this.showApplyFuelCard = selectedText === 'Apply Fuel Card';
    if (this.showApplyFuelCard) {
      this.requestForm.setControl('BenefitTypeForm', this.fuelCardForm);
    }
    this.showSubsidizedMedicine = selectedText === 'Subsidized Medicine';
    if (this.showSubsidizedMedicine) {
      this.requestForm.setControl('BenefitTypeForm', this.designationSubsidyForm);
    }
  }
  getBenefitsSummary(requester, content) {
    this.isActive = requester.requestStage.isActive;
    this.status= requester.requestStage.status;
    // this.toggleSummary();
    this.openEnd(content);
    this.summaryAttachments = [];
    this.teamRequestForm.reset();
    this.currentRequestStageId = requester.requestStage.requestStageId;
    this.summaryItem = requester;
    this._beneFitS.getBenefitRequestSummary(requester.benefitId).subscribe(res => {
      this.checkBenefitType(res.data.benefitType)
      res.data.benefitTypeForm = JSON.parse(res.data.benefitTypeForm)
      if (res.data.benefitType === 'Apply Fuel Card' || res.data.benefitType === 'Subsidized Medicine') {
        const benefitTypeFormArray = this.requestForm.get('BenefitTypeForm') as FormArray;
        while (benefitTypeFormArray.length !== 0) {
          benefitTypeFormArray.removeAt(0);
        }
        res.data.benefitTypeForm.forEach((item: any) => {
          const formGroup = this.fb.group(item);
          benefitTypeFormArray.push(formGroup);
        });
        this.requestForm.patchValue({
          BenefitDate: res.data.benefitDate,
          Notes: res.data.notes,
        });
      }
      else {
        this.requestForm.patchValue({
          BenefitDate: res.data.benefitDate,
          Notes: res.data.notes,
          BenefitTypeForm: res.data.benefitTypeForm,
        })
      }
      this.summaryAttachments = res.data.benefitAttachments;
      this.requestForm.get('BenefitTypeForm').disable();
      console.log("this.requestForm.value", this.requestForm.value);
      this.requesterDetails = {
        "benefitDate":   this.datePipe.transform(res.data.benefitDate, 'MMM dd, yyyy'),
        "appliedDate":   this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "requester": res.data.requester,
        "notes": res.data.notes
      }
      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =   this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate =   this.datePipe.transform(stage.appliedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
      console.log("requestStages", this.requestStages)
    })
  }



  exportData() {

    const obj = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.benefitStatus,
      sortBy: this.sortBy
    }
    this._beneFitS.getBenefitsReport(obj).subscribe((res: any) => {
      debugger
      const linkSource = res.data
      const downloadLink = document.createElement("a");
      const csvName = 'BenefitDataReport' + '.csv';
      downloadLink.href = linkSource;
      downloadLink.download = csvName;
      downloadLink.click();
    });
  }


}
