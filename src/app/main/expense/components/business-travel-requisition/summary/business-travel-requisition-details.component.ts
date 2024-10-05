import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { BusinessTravelRequisitionService } from '../../../services/business-travel-requisition.service';
import * as moment from 'moment';
import { LeavesService } from 'src/app/main/leaves/services/leaves.service';
import { BusinessTravelSharedMethods } from '../../../shared/business-travel-shared-methods';
import { ToasterService } from 'src/app/services/toaster.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-business-travel-requisition-details',
  templateUrl: './business-travel-requisition-details.component.html',
  styleUrls: ['./business-travel-requisition-details.component.css']
})
export class BusinessTravelRequisitionDetailsComponent implements OnInit {
  currentId: number;
  leaveQuota: any;
  sharedMethods = this.shared;
  summaryAttachments: any[] = [];
  requesterDetails: any = {};
  requestStages: any;
  travelRequisitionSummaryDetails: any[] = [];
  travelTypeItems: any[] = [];
  constructor(_hS: HeaderService, private spinner: NgxSpinnerService, private shared: BusinessTravelSharedMethods, private _toastS: ToasterService,
    private _reiS: BusinessTravelRequisitionService, private _lS: LeavesService, private _route: ActivatedRoute,private datePipe:DatePipe) {
    _hS.updateHeaderData({
      title: 'Requisition Details',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit() {
    this._route.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
    })
    this.getLeaveQuote();
    this.getRequisitionSummary();
  }
  getRequisitionSummary() {
    this.spinner.show();
    this._reiS.getRequisitionRequestSummary(this.currentId).subscribe(res => {
      this.spinner.hide();
      // this.summaryAttachments = res.data.reimbursementAttachments;
      this.requesterDetails = {
        "requisitionId": this.currentId,
        "statusId": res.data.travelRequisitionSummaryDetails[0].travelStatus,
        "appliedDate": this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy'),
        "email": res.data.email,
        "phoneNumber": res.data.phoneNumber,
        "userName": res.data.userName,
        "requesterId": res.data.requesterId
      }
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

  getLeaveQuote() {
    this._lS.getLeaveQoutaByEmployeeId(Number(localStorage.getItem('userId'))).subscribe((res) => {
      this.leaveQuota = res;
      this.leaveQuota.acquired = res.totalLeaves - res.remainingLeaves;
      console.log("leave quota", this.leaveQuota.acquired);
    })
  }
  get isAllPending() {
    return this.requestStages.some((item) => item.status !== 1)
  }
  cancelRequest(id: any) {
    this._reiS.cancelRequisition(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const leaves = this.leaveItems.filter((item: any) => item.leaveId !== id);
        // this.leaveItems = leaves;
        this.getRequisitionSummary();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Canceled", toastParagrahp: "Requisition Canceled Successfully!" }
        this._toastS.updateToastData(toasterObject)
        this.getRequisitionSummary();
        this._toastS.hide();
      }
    }, (error: any) => {
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }
}
