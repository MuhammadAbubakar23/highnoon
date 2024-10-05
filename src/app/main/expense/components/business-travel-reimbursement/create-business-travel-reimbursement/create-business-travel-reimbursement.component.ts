import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { BusinessTravelRequisitionService } from '../../../services/business-travel-requisition.service';
import { BusinessTravelReimbursementService } from '../../../services/business-travel-reimbursement.service';
import { BusinessTravelSharedMethods } from '../../../shared/business-travel-shared-methods';
import * as moment from 'moment';
import { ExpenseTypeService } from 'src/app/main/console/services/expense-type.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-business-travel-reimbursement',
  templateUrl: './create-business-travel-reimbursement.component.html',
  styleUrls: ['./create-business-travel-reimbursement.component.css']
})
export class CreateBusinessTravelReimbursementComponent implements OnInit {
  formForDeletion: any[];
  index: number;
  requesterDetails: any = {};
  requestStages: any;
  flag = true;
  travelReimbursementSummaryDetails: any[] = [];
  currentId: number;
  tripForms: FormGroup[] = [];
  travelReimbursementForm: FormGroup;
  currencyTypeItems: any[] = [];
  expenseTypeItems: any[]=[];
  expenseTypes: any = [];
  totalExpense: number = 0;
  travelPreferenceItems: any[] = [];
  sharedMethods = this.shared;
  tripForm: FormGroup;
  selectedFiles: { [key: number]: any[] } = {};
  departureDateControl = new FormControl();
  travelClass: any[] = [
    { name: 'Economy', id: 1 },
    { name: 'Business', id: 2 },
  ];

  constructor(private fb: FormBuilder, _hS: HeaderService, private spinner: NgxSpinnerService, private _toastS: ToasterService, private _BS: BusinessTravelRequisitionService,
    private _r: Router, private _reiS: BusinessTravelReimbursementService, private _route: ActivatedRoute,
    private shared: BusinessTravelSharedMethods, private eS: ExpenseTypeService,private datePipe:DatePipe) {
    _hS.updateHeaderData({
      title: 'Apply Travel Reimbursement',
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
    this.getReimbursementSummary(this.currentId);
    this.createForm();
  }


  createForm() {
    this.travelReimbursementForm = this.fb.group({
      addTravelReimbursementDetails: this.fb.array([])
    })
  }

  createTripArray(travelRequisitionDetailId) {
    return this.fb.group({
      travelReimbursmentDetailId: 0,
      travelReimbursmentMasterId: 0,
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
    this.travelReimbursementSummaryDetails.forEach((e) => {
      control.push(this.createTripArray(e.travelRequisitionDetailId));
    })
  }

  addTripFromFront(travelRequisitionDetailId) {

    const control = <FormArray>this.travelReimbursementForm.get('addTravelReimbursementDetails');
    control.push(this.createTripArray(travelRequisitionDetailId));
  }

  deleteTripFromLast(travelRequisitionDetailId) {
    const control = this.travelReimbursementForm.get('addTravelReimbursementDetails') as FormArray;

    const formsToRemove = control.controls.filter(form => {
      return form.value.travelRequisitionDetailId === travelRequisitionDetailId;
    });

    if (formsToRemove.length > 0) {
      const lastIndex = control.controls.lastIndexOf(formsToRemove[formsToRemove.length - 1]);
      control.removeAt(lastIndex);
    }
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

  submitForm(): void {

    if (this.travelReimbursementForm.valid) {

      console.log(this.travelReimbursementForm.value)
      let tripForms = this.travelReimbursementForm.get('addTravelReimbursementDetails')?.value as any[];
      const data = {
        "travelReimbursementMasterId": 0,
        "travelRequisitionMasterId": this.currentId,
        "requestName": this.requesterDetails.requestName,
        "userId": localStorage.getItem('userId'),
        "travelStatusId": 1,
        "addTravelReimbursementDetails": tripForms,
      };
      this.expenseTypes.forEach(expense => {
        data[expense.name] = expense.amount;
      });

      this._reiS.createTravelReimbursement(data).subscribe((res) => {
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
    }
    else {
      this.markFormGroupTouched(this.travelReimbursementForm);
    }
  }
  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
    this.flag = false;
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
  // isAttachmentValid(tripIndex: number){
  //   if(!this.selectedFiles[tripIndex] && this.flag == false){
  //     return false;
  //   }
  //   else
  //     return true ;
  // }
  getReimbursementSummary(requester) {
    this.spinner.show();
    this._reiS.getRequisitionRequestSummary(this.currentId).subscribe(res => {
      this.spinner.hide();
      this.requesterDetails = {
        "appliedDate": this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "email": res.data.email,
        "phoneNumber": res.data.phoneNumber,
        "userName": res.data.userName,
        "requesterId": res.data.requesterId,
        "requestName": res.data.requestName
      }
      console.log("this.requesterDetails", this.requesterDetails);
      this.travelReimbursementSummaryDetails = res.data.travelRequisitionSummaryDetails;
      const attachmentsArray = res.data.travelRequisitionAttachments;
      const DataArray = res.data.travelRequisitionSummaryDetails;
      DataArray.forEach((i) => {
        i.travelRequisitionAttachmentDetails = [];
        attachmentsArray?.forEach((j) => {
          if (i.travelRequisitionDetailId == j.travelRequisitionDetailId) {
            i.travelRequisitionAttachmentDetails.push(j)
          }
        })
      })
      console.log("Updated Response", res);
      res.data?.requestStages?.forEach((stage) => {
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
    })
    console.log("expense types: ",this.expenseTypes);
  }
  addAmount(){

    this.totalExpense = 0;
    this.emptyExpenseAmounts();
    const trips = this.getTrip(this.travelReimbursementForm);
    trips.forEach((trip)=>{
      if(trip.value.claimAmount != null){
        var num: number = +trip.value.claimAmount;

        const foundexpenseType = this.expenseTypes.find(expenseType => expenseType.id === trip.value.expenseType);
        foundexpenseType.amount = foundexpenseType.amount + num;

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

