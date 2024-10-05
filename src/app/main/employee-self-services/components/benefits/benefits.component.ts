import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, inject, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Status } from 'src/app/shared/models/statuss';
import { HeaderService } from 'src/app/services/header.service';
import { DateTimeFormatService } from 'src/app/shared/services/date-time-format.service';
import { BenefitsService } from '../../services/benefits.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { CustomValidators } from 'src/app/validators/custom.validators';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
//https://hnbackend.enteract.app:8445/BenefitAttachments/1/d6a90561-a39b-4e68-9de9-dd3254d3b473.png

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.css']
})
export class BenefitsComponent implements OnInit {
  benefitsItems: any = [];
  isButtonDisabled = false;
  desColumns = ['benefitDate', 'benefitType', 'benefitStatus'];
  columnNames = ['Date', 'Type', 'Status'];
  statuss = Status;
  totalRequest: number = 0;
  approved: number = 0;
  pending: number = 0;
  rejected: number = 0;
  imageBaseUrl = environment.imageBaseUrl;
  showOffcanvas: boolean = false;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  itemsPerPage: number = 10;
  text = "";
  startDate = "";
  endDate = "";
  benefitStatus = 0;
  selectedBenefitStatus = "";
  sortBy = "";
  selectedSort = ""
  currentId = 0;
  benefitTypes: any[] = [];
  medicines: any[] = [];
  requesterDetails: any = {};
  loanDetails: any = {};
  requestStages: any = [];
  showVehicleRequest = false;
  showInterestFreeLoan = false;
  showMobilePackage = false;
  showAllowanceRequest = false;
  showInternetDevice = false;
  showApplyFuelCard = false;
  showSubsidizedMedicine = false;
  selectedFiles: File[] = [];
  summaryAttachments: any[] = [];
  isDisabled: boolean = true;
  availabilityLimit = ""
  @ViewChild('formFileInput') formFileInput!: ElementRef;

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


  internetDeviceForm = new FormGroup({
    InternetDeviceId: new FormControl(0, [Validators.required]),
    DeviceType: new FormControl('', Validators.required),
    Preference1: new FormControl('', Validators.required),
    Preference2: new FormControl('', Validators.required),
  });
  private offcanvasService = inject(NgbOffcanvas);
  openEnd(content: TemplateRef<any>) {
    this.initializeForm();
    this.offcanvasService.open(content, { position: 'end' });
  }
  closeOffset(content: TemplateRef<any>) {
    this.initializeForm();
    this.offcanvasService.dismiss(content);
  }

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
    BenefitDate: new FormControl('', [Validators.required]),
    Notes: new FormControl('', [Validators.required]),
    Status: new FormControl(1, [Validators.required]),
    BenefitTypeId: new FormControl(null, [Validators.required]),
    BenefitType: new FormControl('', [Validators.required]),
    UserId: new FormControl(localStorage.getItem('userId')),
    BenefitTypeForm: new FormGroup({}, [Validators.required]),
    Files: this.fb.array([])
  })
  addFuelControl() {

    this.bTAF.push(this.createFuelCardControl());
    console.log(this.requestForm)
  }
  // removeFuelControl(index: number){
  //   this.sMF.removeAt(index);
  //  }


  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _dDFS: DateTimeFormatService, private _beneFitS: BenefitsService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private fb: FormBuilder, private _DropDownS: DropDownApiService, private _per: MenuPermissionService) {

    let tabs = [];
    let isTabActive = true;
    if (this._per.hasPermission('My Benefits')) {
      tabs.push({ title: 'Benefits', url: 'connect/employee-self-services/benefits', isActive: true })
    }
    if (this._per.hasPermission('Team Benefits')) {
      tabs.push({ title: 'Team Requests', url: 'connect/employee-self-services/benefits/team-requests', isActive: false })
    }
    else {
      isTabActive = false;
    }
    this._hS.updateHeaderData({
      title: 'Benefits',
      tabs: tabs,
      isTab: isTabActive,
    })

  }

  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
    this.getBenefits();
    this._DropDownS.getBenefitTypeForDD().subscribe((res) => {
      this.benefitTypes = res.data;
    })
    const desId = Number(localStorage.getItem('designationId'))
    this._beneFitS.getMedicineSubsidyByDesignation(desId).subscribe((res) => {
      this.medicines = res.data;
    })
  }
  replaceBenefitTypeForm() {
    this.requestForm.setControl('BenefitTypeForm', this.interestFreeLoanForm);
  }
  getBenefits() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      text: this.text,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.benefitStatus,
      sortBy: this.sortBy
    }
    this.spinner.show();

    this._beneFitS.getBenefits(data).subscribe((res) => {
      this.benefitsItems = res.pagedReponse.data;
      this.totalPages = res.pagedReponse.totalPages;
      this.totalRecords = res.pagedReponse.totalRecords;
      this.benefitsItems.forEach(element => {
        element.benefitDate =   this.datePipe.transform(element.benefitDate, 'MMM dd, yyyy');
      });
      this.approved = res.approved;
      this.pending = res.pending;
      this.rejected = res.rejected
      this.totalRequest = this.approved + this.pending + this.rejected;

      this.spinner.hide();

    })

  }

  get benefitStatusKeys() {
    const keys = Object.keys(this.statuss);
    return keys
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
  generalFilter() {
    //this.getLeaves();
  }
  resetEndDate() {
    this.endDate = '';
  }

  filterByDate() {
    if (this.endDate >= this.startDate) {
      this.getBenefits();
    } else {
      this.endDate = '';
      alert('EndDate is greater than StartDate');
    }
  }

  addCustomValidator() {

    const requiredTo = this.vehicleRequestForm.get('RequiredTo').value;

    if (requiredTo !== null) {
      this.vehicleRequestForm.setValidators(
        CustomValidators.benefitDateValidator('RequiredFrom', 'RequiredTo')
      );
      this.vehicleRequestForm.updateValueAndValidity();
    }
  }

  get isDurationOk(): boolean {
    return (
      this.vehicleRequestForm.getError('invalidDuration') &&
      // this.bVF['RequiredTo'].value.touched
      this.vehicleRequestForm.get('RequiredTo').touched
    );
  }

  filterByStatus(key: any) {

    this.benefitStatus = Number(this.statuss[key]);
    this.selectedBenefitStatus = key;

    this.getBenefits();
  }

  sortDataBy(columnName) {
    this.sortBy = columnName;
    this.getBenefits()

  }
  refreshPage() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.text = "";
    this.getCurrentMonthDateFormatted();
    this.selectedBenefitStatus = "Status";
    this.benefitStatus = 0;
    this.sortBy = "";
    this.getBenefits();
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
      this.getBenefits();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getBenefits();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getBenefits();
    }
  }

  addArrayCustomValidator() {

    this.requestForm.setControl('BenefitTypeForm', this.designationSubsidyForm);
    const benefitTypeForm = this.requestForm.get('BenefitTypeForm') as FormArray;
    this.requestForm.setValidators(
      CustomValidators.addArrayCustomValidator(benefitTypeForm)
    );
    this.requestForm.updateValueAndValidity();

  }
  get isQuantityOk(): boolean {

    var val;
    var benefitTypeFormm = this.requestForm.get('BenefitTypeForm')
    val = true;
    console.log("isQuantityOkFunc->>>", benefitTypeFormm)
    benefitTypeFormm.value.forEach(e => {
      // val =
      //   this.requestForm.getError('requiredQuantity') || false
      //   &&
      //   benefitTypeFormm.touched
      if (this.requestForm.getError('requiredQuantity')) {
        val = false;
      }
    })
    return val;
  }
  addSubsiizedForm() {

    const benefitTypeForm = this.requestForm.get('BenefitTypeForm') as FormArray;
    if (benefitTypeForm.length == 0) {
      this.medicines.forEach(medicine => {
        console.log("Adding---->", medicine)
        const rowFormGroup = this.fb.group({
          DesignationSubsidizedMedicineId: new FormControl(medicine.designationSubsidizedMedicineId, [Validators.required]),
          AvailableMedicineId: new FormControl(medicine.availableMedicineId, Validators.required),
          Name: new FormControl(medicine.name, Validators.required),
          MarketPrice: new FormControl(medicine.marketPrice, [Validators.required, Validators.min(0)]),
          SubsidizedPrice: new FormControl(medicine.subsidizedPrice, [Validators.required, Validators.min(0)]),
          Quantity: 0
        });
        console.log("formarray-->", benefitTypeForm);
        benefitTypeForm.push(rowFormGroup);
      });
      this.addArrayCustomValidator();
    }
  }

  getBenefitAvailability(bTypeId: number) {

    const desId = localStorage.getItem('designationId')
    this._beneFitS.getBenefitAvailablity(bTypeId, desId).subscribe((res) => {
      this.availabilityLimit = res.data.limit;
    })
  }
  onBenefitTypeChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = selectElement.selectedIndex;
    if (selectedIndex !== -1) {
      const selectedOption = selectElement.options[selectedIndex];
      const selectedText = selectedOption.textContent.trim();
      this.requestForm.get('BenefitType').setValue(selectedText)
      this.showVehicleRequest = selectedText === 'Official Vehicle Request';
      if (this.showVehicleRequest) {
        this.requestForm.setControl('BenefitTypeForm', this.vehicleRequestForm);
      }
      this.showInterestFreeLoan = selectedText === 'Employee Interest Free Loan';
      if (this.showInterestFreeLoan) {
        this.getBenefitAvailability(Number(selectedValue));
        this.requestForm.setControl('BenefitTypeForm', this.interestFreeLoanForm);
      }
      this.showMobilePackage = selectedText === 'Official Mobile Package';
      if (this.showMobilePackage) {
        this.getBenefitAvailability(Number(selectedValue));
        this.requestForm.setControl('BenefitTypeForm', this.mobilePackageForm);
      }
      this.showAllowanceRequest = selectedText === 'Mobile Allowance Request';
      if (this.showAllowanceRequest) {
        this.getBenefitAvailability(Number(selectedValue));
        this.requestForm.setControl('BenefitTypeForm', this.mobileAllowanceForm);
      }
      this.showInternetDevice = selectedText === 'Internet Device';
      if (this.showInternetDevice) {
        this.requestForm.setControl('BenefitTypeForm', this.internetDeviceForm);
      }
      this.showApplyFuelCard = selectedText === 'Apply Fuel Card';
      if (this.showApplyFuelCard) {
        this.getBenefitAvailability(Number(selectedValue));
        this.requestForm.setControl('BenefitTypeForm', this.fuelCardForm);
      }
      this.showSubsidizedMedicine = selectedText === 'Subsidized Medicine';
      if (this.showSubsidizedMedicine) {
        this.getBenefitAvailability(Number(selectedValue));
        this.requestForm.setControl('BenefitTypeForm', this.designationSubsidyForm);
        this.addSubsiizedForm();
      }
      this.requestForm.get('BenefitTypeForm').enable();
    }
  }
  // get sMF(): AbstractControl[] | null {
  //   const benefitTypeForm = this.requestForm.get('BenefitTypeForm');
  //   return benefitTypeForm instanceof FormArray ? (benefitTypeForm.controls as AbstractControl[]) : null;
  // }

  get bRF() {
    return this.requestForm.controls
  }
  get bVF() {
    return this.vehicleRequestForm.controls
  }
  get bILF() {
    return this.interestFreeLoanForm.controls
  }
  get bMPF() {
    return this.mobilePackageForm.controls
  }
  get bMAF() {
    return this.mobileAllowanceForm.controls
  }
  get bIDF() {
    return this.internetDeviceForm.controls
  }
  get bTAF(): FormArray {
    return this.requestForm.get('BenefitTypeForm') as FormArray;
  }
  get bTOF() {
    return this.requestForm.get('BenefitTypeForm');
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedFiles = [];
      for (let i = 0; i < fileInput.files.length; i++) {
        this.selectedFiles.push(fileInput.files[i]);
      }
    }
    console.log("selected files", this.selectedFiles);
  }
  removeFile(index) {
    this.selectedFiles.splice(index, 1);
    // if (this.formFileInput) {
    //   console.log("Removed file",this.selectedFiles.length)
    //
    //   this.formFileInput.nativeElement.value = `${this.selectedFiles.length} files}`;
    // }
  }
  initializeForm() {
    this.selectedFiles = [];
    this.showOffcanvas = !this.showOffcanvas;
    this.requestForm = new FormGroup({
      BenefitId: new FormControl(0),
      BenefitDate: new FormControl('', [Validators.required]),
      Notes: new FormControl('', [Validators.required]),
      Status: new FormControl(1, [Validators.required]),
      BenefitTypeId: new FormControl(null, [Validators.required]),
      BenefitType: new FormControl('', [Validators.required]),
      UserId: new FormControl(localStorage.getItem('userId')),
      BenefitTypeForm: new FormGroup({}, [Validators.required]),
      Files: this.fb.array([])
    })
    if (this.formFileInput) {
      this.formFileInput.nativeElement.value = '';
    }
    this.showVehicleRequest = false;
    this.showInterestFreeLoan = false;
    this.showMobilePackage = false;
    this.showAllowanceRequest = false;
    this.showInternetDevice = false;
    this.showApplyFuelCard = false;
    this.showSubsidizedMedicine = false;
  }
  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
  submitForm(content) {

    if (this.requestForm.valid) {
      this.isButtonDisabled = true;
      console.log("BenefitTypeForm", this.requestForm.get('BenefitTypeForm')?.value)
      console.log('submitForm', this.requestForm.value);
      const formData = new FormData();
      formData.append('BenefitId', this.requestForm.get('BenefitId')?.value);
      formData.append('BenefitDate', this.requestForm.get('BenefitDate')?.value);
      formData.append('Notes', this.requestForm.get('Notes')?.value);
      formData.append('Status', this.requestForm.get('Status')?.value);
      formData.append('BenefitTypeId', this.requestForm.get('BenefitTypeId')?.value);
      formData.append('BenefitType', this.requestForm.get('BenefitType')?.value);
      formData.append('UserId', this.requestForm.get('UserId')?.value);

      console.log("Stringify", JSON.stringify(this.requestForm.get('BenefitTypeForm')?.value));
      formData.append('BenefitTypeForm', JSON.stringify(this.requestForm.get('BenefitTypeForm')?.value));
      if (this.currentId !== 0 && this.currentId !== undefined) {
        const data = formData;
        this._beneFitS.updateBenefit(data).subscribe((res) => {
          if (res.statusCode === 200) {
            this.closeOffset(content);
            this.requestForm.reset();
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Benefit Updated Successfully!" }
            this._toastS.updateToastData(toasterObject)
            this.getBenefits();
            this._toastS.hide();
          }

        }, (error: any) => {
          this.closeOffset(content);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
      else {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          formData.append('Files', this.selectedFiles[i]);
        }
        const data = formData;
        this._beneFitS.createBenefit(data).subscribe((res) => {
          this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            this.closeOffset(content);
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Request Sent Successfully", toastParagrahp: "Your Benefit Request has been sent for approval." }
            this._toastS.updateToastData(toasterObject)
            this.getBenefits();
            this._toastS.hide();

          }

        }, (error: any) => {
          this.closeOffset(content);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
        })
      }
    }

    else {
      this.markFormGroupTouched(this.requestForm);
    }


  }
  get isAllPending() {
    return this.requestStages.some((item) => item.status !== 1)
  }
  cancelRequest(id: any, content) {

    this._beneFitS.cancelBenefit(id).subscribe((res) => {
      this.closeOffset(content)
      if (res.statusCode === 200) {
        // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
        // this.leaveItems = leaves;
        this.getBenefits();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Canceled", toastParagrahp: "Benefit Request Canceled Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this.getBenefits();
        this._toastS.hide();
      }
    }, (error: any) => {
      this.closeOffset(content)
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }
  checkBenefitType(typeId: number, type: string) {
    const selectedText = type.trim();
    this.requestForm.get('BenefitType').setValue(selectedText)
    this.showVehicleRequest = selectedText === 'Official Vehicle Request';
    if (this.showVehicleRequest) {
      this.requestForm.setControl('BenefitTypeForm', this.vehicleRequestForm);
    }
    this.showInterestFreeLoan = selectedText === 'Employee Interest Free Loan';
    if (this.showInterestFreeLoan) {
      this.getBenefitAvailability(typeId);
      this.requestForm.setControl('BenefitTypeForm', this.interestFreeLoanForm);
    }
    this.showMobilePackage = selectedText === 'Official Mobile Package';
    if (this.showMobilePackage) {
      this.getBenefitAvailability(typeId);
      this.requestForm.setControl('BenefitTypeForm', this.mobilePackageForm);
    }
    this.showAllowanceRequest = selectedText === 'Mobile Allowance Request';
    if (this.showAllowanceRequest) {
      this.getBenefitAvailability(typeId);
      this.requestForm.setControl('BenefitTypeForm', this.mobileAllowanceForm);
    }
    this.showInternetDevice = selectedText === 'Internet Device';
    if (this.showInternetDevice) {
      this.requestForm.setControl('BenefitTypeForm', this.internetDeviceForm);
    }
    this.showApplyFuelCard = selectedText === 'Apply Fuel Card';
    if (this.showApplyFuelCard) {
      this.getBenefitAvailability(typeId);
      this.requestForm.setControl('BenefitTypeForm', this.fuelCardForm);
    }
    this.showSubsidizedMedicine = selectedText === 'Subsidized Medicine';
    if (this.showSubsidizedMedicine) {
      this.getBenefitAvailability(typeId);
      this.requestForm.setControl('BenefitTypeForm', this.designationSubsidyForm);
    }
    else {

    }
  }
  getBenefitsSummary(requester, content) {
    this.summaryAttachments = [];
    this.openEnd(content);
    this._beneFitS.getBenefitRequestSummary(requester.benefitId).subscribe(res => {
      this.checkBenefitType(res.data.benefitTypeId, res.data.benefitType)
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
        "reimbursementId": requester.benefitId,
        "statusId": res.data.status,
        "benefitDate": this.datePipe.transform(res.data.benefitDate, 'MMM dd, yyyy'),
        "appliedDate":   this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "requester": res.data.requester,
        "notes": res.data.notes,
      }
      this.loanDetails['totalLoan'] = res.data.totalLoan
      this.loanDetails['totalLoanReturned'] = res.data.totalLoanReturned
      this.loanDetails['totalLoan'] = res.data.totalLoan,
        this.loanDetails['paymentBreakDown'] = res.data.paymentBreakDown
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
  cancel(content) {
    const benefitTypeForm = this.requestForm.get('BenefitTypeForm') as FormArray;
    if (this.requestForm?.value?.BenefitType == 'Subsidized Medicine') {
      const arr = this.requestForm?.get('BenefitTypeForm') as FormArray;
      arr.value.forEach(()=>{
        arr.removeAt(0);
      })
    }
    this.closeOffset(content);
  }
  // getBenefitDetails() {
  //
  //   this._beneFitS.getBenefitById(this.currentId).subscribe((res:any) => {
  //
  //     const parsedStartDate = new Date(res.data.benefitDate);
  //     res.data.benefitDate = this.datePipe.transform(parsedStartDate, 'yyyy-MM-dd'),
  //     // res.data.benefitDate = moment(parsedStartDate).format('MM/DD/YYYY')
  //     console.log('res.data.benefitDate',res.data.benefitDate)
  //     this.requestForm.patchValue({
  //       BenefitDate: res.data.benefitDate,
  //       BenefitTypeId: res.data.benefitTypeId,
  //       BenefitType: res.data.benefitType.type,
  //       UserId: res.data.UserId,
  //       Status: res.data.status,
  //       benefitTypeForm: res.data.benefitTypeForm,
  //       Notes: res.data.notes
  //     })

  //     const benefitTypeForm = JSON.parse(res.data.benefitTypeForm);

  //     this.showVehicleRequest = res.data.benefitType.type === 'Official Vehicle Request';
  //     if (this.showVehicleRequest) {
  //       this.vehicleRequestForm.patchValue(benefitTypeForm)
  //       this.requestForm.setControl('BenefitTypeForm', this.vehicleRequestForm);
  //     }
  //     this.showInterestFreeLoan = res.data.benefitType.type === 'Employee Interest Free Loan';
  //     if (this.showInterestFreeLoan) {
  //       this.interestFreeLoanForm.patchValue(benefitTypeForm)
  //       this.requestForm.setControl('BenefitTypeForm', this.interestFreeLoanForm);
  //     }
  //     this.showMobilePackage = res.data.benefitType.type === 'Official Mobile Package';
  //     if (this.showMobilePackage) {
  //       this.mobilePackageForm.patchValue(benefitTypeForm)
  //       this.requestForm.setControl('BenefitTypeForm', this.mobilePackageForm);
  //     }
  //     this.showAllowanceRequest = res.data.benefitType.type === 'Mobile Allowance Request';
  //     if (this.showAllowanceRequest) {
  //       this.mobileAllowanceForm.patchValue(benefitTypeForm)
  //       this.requestForm.setControl('BenefitTypeForm', this.mobileAllowanceForm);
  //     }
  //     this.showInternetDevice = res.data.benefitType.type === 'Internet Device';
  //     if (this.showInternetDevice) {
  //       this.internetDeviceForm.patchValue(benefitTypeForm)
  //       this.requestForm.setControl('BenefitTypeForm', this.internetDeviceForm);
  //     }
  //     this.showApplyFuelCard = res.data.benefitType.type === 'Apply Fuel Card';
  //     if (this.showApplyFuelCard) {
  //       this.arrayDataPatch(benefitTypeForm, this.fuelCardForm);
  //       // this.requestForm.setControl('BenefitTypeForm', this.fuelCardForm);
  //       // const benefitTypeFormArray = this.requestForm.get('BenefitTypeForm') as FormArray;
  //       // while (benefitTypeFormArray.length !== 0) {
  //       //   benefitTypeFormArray.removeAt(0);
  //       // }
  //       // benefitTypeForm.forEach((item: any) => {
  //       //   const formGroup = this.fb.group(item);
  //       //   benefitTypeFormArray.push(formGroup);
  //       // });
  //     }
  //     this.showSubsidizedMedicine = res.data.benefitType.type === 'Subsidized Medicine';
  //     if (this.showSubsidizedMedicine) {
  //
  //       this.arrayDataPatch(benefitTypeForm, this.designationSubsidyForm);
  //       // this.requestForm.setControl('BenefitTypeForm', this.designationSubsidyForm);
  //       // const benefitTypeFormArray = this.requestForm.get('BenefitTypeForm') as FormArray;
  //       // while (benefitTypeFormArray.length !== 0) {
  //       //   benefitTypeFormArray.removeAt(0);
  //       // }
  //       // benefitTypeForm.forEach((item: any) => {
  //       //   const formGroup = this.fb.group(item);
  //       //   benefitTypeFormArray.push(formGroup);
  //       // });
  //     }
  //   })

  // }

  // arrayDataPatch(benefitTypeForm, FormName){
  //   this.requestForm.setControl('BenefitTypeForm', this.designationSubsidyForm);
  //   const benefitTypeFormArray = this.requestForm.get('BenefitTypeForm') as FormArray;
  //   while (benefitTypeFormArray.length !== 0) {
  //     benefitTypeFormArray.removeAt(0);
  //   }
  //   benefitTypeForm.forEach((item: any) => {
  //     const formGroup = this.fb.group(item);
  //     benefitTypeFormArray.push(formGroup);
  //   });
  // }

  // editBenefit(id: any) {
  //
  //   this.showOffcanvas = true;
  //   this.currentId = id;
  //   this.getBenefitDetails();
  // }
  // deleteBenefit(id: any) {

  //   this._beneFitS.deleteLeave(id).subscribe((res) => {

  //     if (res.statusCode === 200) {
  //       // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
  //       // this.leaveItems = leaves;
  //       this.getLeaves();
  //       const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Leave Deleted Successfully!" }
  //       this._toastS.updateToastData(toasterObject)
  //       this.getLeaveQuote()
  //       this._toastS.hide();
  //     }
  //   }, (error: any) => {

  //     const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
  //     this._toastS.updateToastData(toasterObject)
  //     this._toastS.hide();
  //   })
  // }
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

  downloadFile(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }
}
