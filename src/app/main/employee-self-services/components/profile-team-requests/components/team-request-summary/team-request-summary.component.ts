import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/main/console/services/employee.service';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-team-request-summary',
  templateUrl: './team-request-summary.component.html',
  styleUrls: ['./team-request-summary.component.css']
})
export class TeamRequestSummaryComponent implements OnInit {
  requesterDetails: any = {};
  requestStages: any = [];
  currentId: 0
  isSummary = false;
  requestId: number = 0;
  currentRequestStageId = 0;
  imageBaseUrl = environment.imageBaseUrl;

  teamRequestForm = new FormGroup(
    {
      description: new FormControl('', [Validators.required,
      Validators.maxLength(200)])
    }
  )
  reqObj: any;
  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _pS: EmployeeService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private _dropDown: DropDownApiService, private _per: MenuPermissionService, private _activatedR: ActivatedRoute, private _route: Router) {

    let tabs = [];
    let isTabActive = false;
    if (this._per.hasPermission('Team Profile')) {
      tabs.push({ title: '', url: '', isActive: true })
    }
    else {
      this._route.navigateByUrl('/connect/dashborad/my-dashboard');
    }

    this._hS.updateHeaderData({
      title: 'Profile Team Request Summary',
      tabs: tabs,
      isTab: isTabActive,
    })

  }
  ngOnInit() {
    this._activatedR.queryParams.subscribe(params => {

      this.requestId = params['Id'];
      this.currentRequestStageId = Number(params['requestStageId']);
      if (this.requestId !== 0 && this.requestId !== undefined) {
        this.getRequestSummary()
      }
    });

  }

  get rF() {
    return this.teamRequestForm.controls;
  }
  getRequestSummary() {

    this._pS.getRequestSummary(this.requestId).subscribe(res => {
      this.isSummary = true;
      res.data.appliedDate =   this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy');
      this.requesterDetails = res.data;
      res.data.requestStages.forEach((stage) => {
        if (stage.modifiedDate === null) {
          stage.modifiedDate =   this.datePipe.transform(stage.createdDate, 'MMM dd, yyyy');
        }
        else {
          stage.modifiedDate =   this.datePipe.transform(stage.modifiedDate, 'MMM dd, yyyy');
        }
      })
      this.requestStages = res.data.requestStages;
      this.reqObj = this.requestStages.find((item) => item.requestStageId === this.currentRequestStageId)
      this.reqObj.isActive = this.reqObj.isActive;


    })
  }


  updateRequest(reqstageId: number, statusId: number) {

    const data = {
      "requestStageId": reqstageId,
      "approverId": localStorage.getItem('userId'),
      "description": this.teamRequestForm.get('description').value,
      "status": statusId
    }

    this._pS.updateRequestStage(data).subscribe((res) => {
      //this.closeOffset(content)
      if (res.statusCode === 200) {

        let message = ""
        if (statusId === 2) {
          message = "You have approved the Profile successfully."
        }
        if (statusId === 3) {
          message = "You have rejected the Profile."
        }
        if (statusId === 5) {
          message = "You have hold the Profile."
        }
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "SuccessFull", toastParagrahp: message }
        this.getRequestSummary()
        this._toastS.updateToastData(toasterObject);
        this._toastS.hide();
      }
      if (res.statusCode === 404) {

        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Failed", toastParagrahp: res.data }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      }

    }, (error: any) => {

      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })
  }

}

