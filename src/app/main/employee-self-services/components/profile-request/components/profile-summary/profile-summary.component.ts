import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.css']
})
export class ProfileSummaryComponent implements OnInit{
  requesterDetails: any = {};
  requestStages: any = [];
  currentId:0
  isSummary: boolean = false
  imageBaseUrl = environment.imageBaseUrl;
  constructor(private _hS: HeaderService, private datePipe: DatePipe, private _pS: EmployeeService, private spinner: NgxSpinnerService,
    private _toastS: ToasterService, private _dropDown: DropDownApiService, private _per: MenuPermissionService,private _activatedR:ActivatedRoute,private _route:Router) {

      let tabs = [];
      let isTabActive = false;
      if (this._per.hasPermission('My Profile')) {
        tabs.push({ title: '', url: '', isActive: true })
      }
      else {
        this._route.navigateByUrl('/connect/dashborad/my-dashboard');
      }

      this._hS.updateHeaderData({
        title: 'Profile Request Summary',
        tabs: tabs,
        isTab: isTabActive,
      })

    }

    ngOnInit(){
      this._activatedR.params.subscribe((params)=>{
      this.currentId = params['id'];
      if(this.currentId !== 0 && this.currentId !== undefined){
       this.getProfileRequestSummary()
      }
      })
    }
    getProfileRequestSummary() {

      this._pS.getRequestSummary(this.currentId).subscribe(res => {
        this.isSummary=true;
        res.data.appliedDate=  this.datePipe.transform(res.data.appliedDate, 'MMM dd, yyyy');
        this.requesterDetails=res.data;
        debugger
        console.log("Leave summary", res);
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


    get isAllPending() {
      return this.requestStages.some((item) => item.status !== 1)
    }

    cancelRequest(id: any) {
      this._pS.cancelProfileRequest(id).subscribe((res) => {
        if (res.statusCode === 200) {
          this.getProfileRequestSummary();
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Canceled", toastParagrahp: "Request Canceled Successfully!" }
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
