import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { BusinessTravelReimbursementService } from '../../../services/business-travel-reimbursement.service';
import * as moment from 'moment';
import { EmployeeService } from 'src/app/main/console/services/employee.service';
import { BusinessTravelSharedMethods } from '../../../shared/business-travel-shared-methods';
import { ExpenseTypeService } from 'src/app/main/console/services/expense-type.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-team-requests-summary',
  templateUrl: './team-requests-summary.component.html',
  styleUrls: ['./team-requests-summary.component.css']
})
export class TeamRequestsSummaryComponent implements OnInit {
  currentId: number;
  summaryAttachments: any[] = [];
  statusId: any;
  previousStatus :any = "Pending";
  employee:any;
  currentRequestStageId = 0;
  status: any;
  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
        Validators.maxLength(200)])
    }
  )
  get rF() {
    return this.teamRequestForm.controls;
  }
  stage: any;
  toggleSummary() {
    this.summaryToggle = !this.summaryToggle
  }
  summaryToggle: boolean = false;
  requesterDetails: any = {};
  requestStages: any;
  travelReimbursementSummaryDetails: any[] = [];
  travelTypeItems: any[] = [];
  travelClassItems: any[] = [];
  expenseTypeItems: any[]=[];
  expenseTypes: any = [];
  totalExpense: number = 0;
  sharedMethods = this.shared;
  travelClass: any[] = [
    { name: 'Economy', id: 1 },
    { name: 'Business', id: 2 },
  ];
  constructor(_hS: HeaderService, private spinner: NgxSpinnerService, private _toastS: ToasterService, private _empS: EmployeeService, private eS: ExpenseTypeService,
    private _reiS: BusinessTravelReimbursementService, private _route: ActivatedRoute, private shared: BusinessTravelSharedMethods,private datePipe:DatePipe) {
    _hS.updateHeaderData({
      title: 'Reimbursement Details',
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
    this.getEmployeeById();
  }
  getReimbursementSummary() {
    this.spinner.show();
    this._reiS.getReimbursementRequestSummary(this.currentId).subscribe(res => {
      this.spinner.hide();
      this.requesterDetails = {
        "appliedDate": this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "email": res.data?.email,
        "phoneNumber": res.data?.phoneNumber,
        "userName": res.data?.userName,
        "travelStatusId": res.data?.travelStatusId,
        "requesterId": res.data?.requesterId
      }
      this.status = "Pending";
      this.stage = this.getStageByUser(res.data?.requestStages);
      this.statusId = this.stage?.status
      if(res.data?.requestStages[0]?.status == 3 || res.data?.requestStages[1]?.status == 3){
        this.previousStatus ="Rejected";
      }
      this.currentRequestStageId = this.stage?.requestStageId;
      console.log(this.stage)
      this.travelReimbursementSummaryDetails = res.data?.travelRequisitionDetails;
      this.addAmount();
      res.data?.requestStages?.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate = this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate = this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data?.requestStages;
    })
  }

  updateRequest(reqstageId: number, statusId: number) {

    this.summaryToggle = false;
    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._reiS.updateRequestStage(data).subscribe((res) => {

      if (res.statusCode === 200) {
        let message = ""
        if (statusId === 2) {
          message = "You have approved the Requisition successfully."
        }
        if (statusId === 3) {
          message = "You have rejected the Requisition."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getReimbursementSummary();
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

  getEmployeeById(){
    this._empS.getEmployeeById(Number(localStorage.getItem('userId'))).subscribe((res: any) => {
      this.employee = res.data.fullName;
      this.getReimbursementSummary();
    })
  }
  getStageByUser(requestStages){
    var stage: any;
      stage = requestStages.find(stage => stage.approver == this.employee);
    return stage;
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
}
