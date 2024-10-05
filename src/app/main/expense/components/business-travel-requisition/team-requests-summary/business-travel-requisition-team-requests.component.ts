import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { BusinessTravelRequisitionService } from '../../../services/business-travel-requisition.service';
import * as moment from 'moment';
import { LeavesService } from 'src/app/main/leaves/services/leaves.service';
import { EmployeeService } from 'src/app/main/console/services/employee.service';
import { BusinessTravelSharedMethods } from '../../../shared/business-travel-shared-methods';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-business-travel-requisition-team-requests',
  templateUrl: './business-travel-requisition-team-requests.component.html',
  styleUrls: ['./business-travel-requisition-team-requests.component.css']
})
export class BusinessTravelRequisitionTeamRequestsComponent implements OnInit {
  currentRequestStageId = 0;
  status: any;
  statusId: any;
  previousStatus :any = "Pending";
  employee:any;
  isActive: any;
  statuss: any;
  stage: any;
  sharedMethods = this.shared;
  currentId: number;
  leaveQuota: any;
  summaryAttachments: any[] = [];
  requesterDetails: any = {};
  summaryToggle: boolean = false;
  requestStages: any;
  travelRequisitionSummaryDetails: any[] = [];
  travelTypeItems: any[] = [];
  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
        Validators.maxLength(200)])
    }
  )
  get rF() {
    return this.teamRequestForm.controls;
  }
  toggleSummary() {
    this.summaryToggle = !this.summaryToggle
  }
  constructor(_hS: HeaderService, private spinner: NgxSpinnerService, private _toastS: ToasterService, private _empS: EmployeeService, private shared: BusinessTravelSharedMethods,
    private _reiS: BusinessTravelRequisitionService, private _route: ActivatedRoute, private _lS: LeavesService, private router: Router,
    private datePipe:DatePipe) {
    _hS.updateHeaderData({
      title: 'Requisition Details',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
    // const navigation = this.router.getCurrentNavigation();
    // this.isActive = navigation?.extras?.state['isActive'];
    // this.statuss = navigation?.extras?.state['status'];
  }
  ngOnInit() {
    this._route.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
    })
    this.getEmployeeById();
    this.getRequisitionSummary();
  }
  getRequisitionSummary() {
    this.spinner.show();
    this._reiS.getRequisitionRequestSummary(this.currentId).subscribe(res => {
      this.spinner.hide();
      this.requesterDetails = {
        "appliedDate":this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "email": res.data.email,
        "phoneNumber": res.data.phoneNumber,
        "userName": res.data.userName,
        "requesterId": res.data.requesterId
      }
      this.getLeaveQuote();
      this.status = "Pending";
      this.stage = this.getStageByUser(res.data?.requestStages);
      this.statusId = this.stage?.status
      if(res.data?.requestStages[0]?.status == 3 || res.data?.requestStages[1]?.status == 3){
        this.previousStatus ="Rejected";
      }
      this.currentRequestStageId = this.stage?.requestStageId;
      console.log(this.stage)
      this.travelRequisitionSummaryDetails = res.data.travelRequisitionSummaryDetails;

      res.data.requestStages?.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate = this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate = this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
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
        this._toastS.updateToastData(toasterObject);
        this._toastS.hide();
      }
      if (res.statusCode === 404) {

        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Failed", toastParagrahp: res.data }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      }
      this.getRequisitionSummary();
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

  getLeaveQuote() {
    this._lS.getLeaveQoutaByEmployeeId(this.requesterDetails.requesterId).subscribe((res) => {
      this.leaveQuota = res;
      this.leaveQuota.acquired = res.totalLeaves - res.remainingLeaves;
      console.log("leave quota", this.leaveQuota);
    })
  }

  getEmployeeById(){
    this._empS.getEmployeeById(Number(localStorage.getItem('userId'))).subscribe((res: any) => {
      this.employee = res.data.fullName;
    })
  }
  getStageByUser(requestStages){
    var stage: any;
      stage = requestStages.find(stage => stage.approver == this.employee);
    return stage;
  }
}
