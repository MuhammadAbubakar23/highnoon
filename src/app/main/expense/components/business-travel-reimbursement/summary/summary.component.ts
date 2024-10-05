import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { BusinessTravelReimbursementService } from '../../../services/business-travel-reimbursement.service';
import * as moment from 'moment';
import { BusinessTravelSharedMethods } from '../../../shared/business-travel-shared-methods';
import { ExpenseTypeService } from 'src/app/main/console/services/expense-type.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit{
  currentId: number;
  summaryAttachments: any[] = [];
  requesterDetails: any = {};
  sharedMethods= this.shared;
  requestStages: any;
  expenseTypeItems: any[]=[];
  expenseTypes: any = [];
  totalExpense: number = 0;
  travelReimbursementSummaryDetails: any[] = [];
  travelTypeItems: any[]=[];
  travelClassItems: any[]=[];
  travelClass: any[] = [
    { name: 'Economy', id: 1 },
    { name: 'Business', id: 2 },
  ];
  constructor( _hS: HeaderService, private spinner: NgxSpinnerService, private shared: BusinessTravelSharedMethods, private _toastS: ToasterService,
    private _reiS: BusinessTravelReimbursementService, private _route: ActivatedRoute, private eS: ExpenseTypeService,private datePipe:DatePipe) {
    _hS.updateHeaderData({
      title: 'Reimbursement Details',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit() {

    this._route.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];})
      this.getExpenseTypes();
      this.getReimbursementSummary();
  }
  getReimbursementSummary() {
    this.spinner.show();
    this._reiS.getReimbursementRequestSummary(this.currentId).subscribe(res => {
      this.spinner.hide();
      console.log("res->>>", res);
      this.requesterDetails = {
        "requisitionId": this.currentId,
        "statusId": res.data.travelStatusId,
        "appliedDate":this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "email": res.data?.email,
        "phoneNumber": res.data?.phoneNumber,
        "userName": res.data?.userName,
        "requesterId": res.data?.requesterId,
        "accomodation": res.data?.accomodation,
        "advanceCurrency": res.data?.advanceCurrency,
        "miscellaneous": res.data?.miscellaneous,
        "travelStatusId": res.data?.travelStatusId,
        "tada": res.data?.tada
      }
      // res.data?.travelReimbursementSummaryDetails?.forEach((i)=>{
      //   i.files = [];
      //   res.data?.travelReimbursementAttachmentDetails?.forEach((j)=>{
      //     if (i.travelReimbursmentDetailId == j.travelReimbursementDetailId){
      //       i.files.push(j)
      //     }
      //   })
      // })
      this.travelReimbursementSummaryDetails = res.data?.travelRequisitionDetails;
      this.addAmount();
      res.data?.requestStages?.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate = this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate = this.datePipe.transform(stage.modifiedDate,'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data?.requestStages;
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
  }
  addAmount(){

    this.totalExpense = 0;
    this.travelReimbursementSummaryDetails.forEach((t)=>{
      const trips = t.travelReimbursementDetails;
      trips.forEach((trip)=>{
        var num: number = +trip.claimAmount;
        const foundexpenseType = this.expenseTypes.find(expenseType => expenseType.name === trip.expenseType);
        foundexpenseType.amount = foundexpenseType.amount + num;

        if(trip.claimAmount != null){
          this.totalExpense= this.totalExpense + num;
        }
      })
    })
  }
  getExpenseType(id) {
    const foundexpenseType = this.expenseTypeItems.find(expenseType => expenseType.expenseTypeId === id);
    if (foundexpenseType) {
        return foundexpenseType.expenseTypeName;
    }
  }
  get isAllPending() {
    return this.requestStages?.some((item) => item.status !== 1)
  }
  cancelRequest(id: any) {

    this._reiS.cancelReimbursement(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
        // this.leaveItems = leaves;
        this.getReimbursementSummary();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Canceled", toastParagrahp: "Requisition Canceled Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this.getReimbursementSummary();
        this._toastS.hide();
      }
    }, (error: any) => {
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }
}
