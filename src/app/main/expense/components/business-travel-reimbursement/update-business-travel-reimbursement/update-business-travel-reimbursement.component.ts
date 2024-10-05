import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { BusinessTravelReimbursementService } from '../../../services/business-travel-reimbursement.service';
import { BusinessTravelSharedMethods } from '../../../shared/business-travel-shared-methods';
import { ExpenseTypeService } from 'src/app/main/console/services/expense-type.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-business-travel-reimbursement',
  templateUrl: './update-business-travel-reimbursement.component.html',
  styleUrls: ['./update-business-travel-reimbursement.component.css']
})
export class UpdateBusinessTravelReimbursementComponent {
  formForDeletion: any[];
  index: number;
  requesterDetails: any = {};
  requestStages: any;
  expenseTypeItems: any[]=[];
  expenseTypes: any = [];
  totalExpense: number = 0;
  travelReimbursementSummaryDetails: any[] = [];
  travelRequisitionSummaryDetails: any[] = [];
  currentId: number;
  tripForms: FormGroup[] = [];
  sharedMethods = this.shared;
  travelReimbursementForm: FormGroup;
  currencyTypeItems: any[] = [];
  travelTypeItems: any[] = [];
  travelPreferenceItems: any[] = [];
  tripForm: FormGroup;
  selectedFiles: { [key: number]: any[] } = {};
  departureDateControl = new FormControl();
  travelClass: any[] = [
    { name: 'Economy', id: 1 },
    { name: 'Business', id: 2 },
  ];

  constructor(private fb: FormBuilder, _hS: HeaderService, private spinner: NgxSpinnerService, private _toastS: ToasterService,  private eS: ExpenseTypeService,
    private _r: Router, private _reiS: BusinessTravelReimbursementService, private _route: ActivatedRoute,
    private shared: BusinessTravelSharedMethods,private datePipe:DatePipe) {
    _hS.updateHeaderData({
      title: 'Update Travel Reimbursement',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit() {

    this._route.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
    })
    this.getExpenseTypes();
    this.createForm();
  }

  createForm() {
    this.travelReimbursementForm = this.fb.group({
      addTravelReimbursementDetails: this.fb.array([])
    })
  }

  createTripArray(travelRequisitionDetailId, travelReimbursmentMasterId, travelReimbursmentDetailId) {
    return this.fb.group({
      travelReimbursmentDetailId: travelReimbursmentDetailId,
      travelReimbursmentMasterId: travelReimbursmentMasterId,
      travelRequisitionDetailId: travelRequisitionDetailId,
      expenseType: [null, Validators.required],
      departureDate: ['', Validators.required],
      dayAmount: [null, Validators.required],
      rate: [null, Validators.required],
      claimAmount: [null, Validators.required],
      description: [null, Validators.required],
      files: this.fb.array([])
    })
  }

  getTrip(form): Array<any> {

    return form.controls.addTravelReimbursementDetails.controls;
  }

  addTrip() {
    const control = <FormArray>this.travelReimbursementForm.get('addTravelReimbursementDetails');
    this.travelRequisitionSummaryDetails.forEach((t)=>{
      this.travelReimbursementSummaryDetails = t.travelReimbursementDetails;
      this.travelReimbursementSummaryDetails.forEach((e) => {
        control.push(this.createTripArray(e.travelRequisitionDetailId, e.travelReimbursmentMasterId, e.travelReimbursmentDetailId));
      })
      console.log("travelReimbursementForm", this.travelReimbursementForm)

      control.controls.forEach((form) => {
        this.travelReimbursementSummaryDetails.forEach((e) => {
          if (e.travelReimbursmentDetailId == form.value.travelReimbursmentDetailId) {
            form.patchValue({
              expenseType: e.expenseTypeId,
              departureDate: this.formatDate(e.departureDate),
              dayAmount: e.dayAmount,
              rate: e.rate,
              claimAmount: e.claimAmount,
              description: e.description
            })
          }
        })
      })
    })
    this.addAmount();
  }


  get tRF() {
    return this.travelReimbursementForm.controls;
  }

  get tRDF(): FormArray {
    return this.travelReimbursementForm.get('addTravelReimbursementDetails') as FormArray;
  }
  tRDFCurrent(form) {
    return form.controls
  }
  get tRAF(): FormArray {
    return this.tripForm.get('addTravelReimbursementDetails') as FormArray;
  }

  getReimbursementSummary(requester) {
    this.spinner.show();
    this._reiS.getReimbursementRequestSummary(this.currentId).subscribe(res => {
      this.spinner.hide();
      this.requesterDetails = {
        "appliedDate": this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "email": res.data.email,
        "phoneNumber": res.data.phoneNumber,
        "userName": res.data.userName,
        "requesterId": res.data.requesterId,
        "travelStatusId": res.data.travelStatusId,
        "accomodation": res.data.accomodation,
        "advanceCurrency": res.data.advanceCurrency,
        "miscellaneous": res.data.miscellaneous,
        "tada": res.data.tada
      }
      this.travelRequisitionSummaryDetails = res.data.travelRequisitionDetails;
      console.log("travelRequisitionSummaryDetails", this.travelRequisitionSummaryDetails);
      res.data.requestStages?.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate = this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate = this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
      this.addTrip();
    })
  }

  getTravelClass(id) {
    const travelClass = this.travelClass.find(travel => travel.id = id)
    if (travelClass) {
      return travelClass.name;
    }
  }
  submitForm(): void {

    if (this.travelReimbursementForm.valid) {

      console.log(this.travelReimbursementForm.value)
      let tripForms = this.travelReimbursementForm.get('addTravelReimbursementDetails')?.value as any[];

        this._reiS.updateTravelReimbursement(tripForms).subscribe((res) => {
          if (res.statusCode === 200) {
            const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Request Sent Successfully", toastParagrahp: "Your Benefit Request has been sent for approval." }
            this._toastS.updateToastData(toasterObject)
            this._r.navigate(['/connect/expense/businesstravelreimbursement']);
            this._toastS.hide();
            console.log("check success")
          }

        }, (error: any) => {
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
          this._toastS.updateToastData(toasterObject)
          this._toastS.hide();
          console.log("check error")
        })
        console.log("check outside")
      // })
    }

  }

  onFileSelected(event: any, tripIndex: number, trip: FormGroup) {

    const fileInput = event.target as HTMLInputElement;
    const filesFormArray = trip.get('files') as FormArray;

    if (!this.selectedFiles[tripIndex]) {
      this.selectedFiles[tripIndex] = [];
    }

    for (let i = 0; i < fileInput.files.length; i++) {
      const file = fileInput.files[i];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        this.selectedFiles[tripIndex].push({ name: file.name, attachements: base64String });

        const fileFormGroup = this.fb.group({
          name: [file.name],
          attachements: [base64String]
        });

        filesFormArray.push(fileFormGroup);
        console.log("filesCheck->>", trip);
        console.log("attachment->>", base64String);
      };

      reader.readAsDataURL(file);
    }
  }

  removeDuplicates(travelRequisitionSummaryDetails: any) {
    let uniqueIds = {};

    this.travelRequisitionSummaryDetails = travelRequisitionSummaryDetails.filter(item => {
      if (uniqueIds.hasOwnProperty(item.travelRequisitionDetailId)) {
        return false;
      }
      uniqueIds[item.travelRequisitionDetailId] = true;
      return true;
    });

    console.log(this.travelRequisitionSummaryDetails);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  getExpenseTypes(){
    this.eS.getExpenseTypes(1,10).subscribe((res) =>  {
      this.expenseTypeItems = res.data;
      this.expenseTypeItems.forEach((e)=>{
        this.expenseTypes.push({
          id: e.expenseTypeId,
          name: e.expenseTypeName,
          amount: 0
        });
      })
      this.getReimbursementSummary(this.currentId);
    })
  }
  addAmount(){

    this.totalExpense = 0;
    this.emptyExpenseAmounts();
    const trips = this.getTrip(this.travelReimbursementForm);
    trips.forEach((trip)=>{
      var num: number = +trip.value.claimAmount;

      const foundexpenseType = this.expenseTypes.find(expenseType => expenseType.id === trip.value.expenseType);
      foundexpenseType.amount = foundexpenseType.amount + num;

      if(trip.value.claimAmount != null){
        this.totalExpense= this.totalExpense + num;
      }
    })
  }
  emptyExpenseAmounts(){
    this.expenseTypes.forEach((e)=>{
      e.amount = 0;
    })
  }
  getExpenseType(id) {
    const foundexpenseType = this.expenseTypeItems.find(expenseType => expenseType.expenseTypeId === id);
    if (foundexpenseType) {
        return foundexpenseType.expenseTypeName;
    }
  }
}
