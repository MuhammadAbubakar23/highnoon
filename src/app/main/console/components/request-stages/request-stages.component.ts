import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { StageService } from '../../services/stage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-request-stages',
  templateUrl: './request-stages.component.html',
  styleUrls: ['./request-stages.component.css']
})
export class RequestStagesComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  currentId = 0;
  reqStageItems: any = [];
  desColumns = ['name', 'username'];
  columnNames = ['Name', "User Name"];
  toastData: any = {};
  users: any[] = []
  reqStageForm = new FormGroup({
    // name: new FormControl('', [Validators.required,Validators.maxLength(200)]),
    // cnic: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    // relation: new FormControl('Mother', [Validators.required,Validators.maxLength(100)]),
    approverId: new FormControl(0, [Validators.required, Validators.maxLength(100)])
  });
  constructor(private _stageS: StageService, private _r: Router, private _toastS: ToasterService,
    private _hS: HeaderService, private spinner: NgxSpinnerService, private _dDS: DropDownApiService) {
    _hS.updateHeaderData({
      title: 'Request Stages',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

  }
  ngOnInit(): void {
    this.getStages();
  }

  getStages() {
    //this.spinner.show();
    this.reqStageItems = [{ name: 'Usman', username: 'admin', requestStageId: 1 }, { name: 'Bilal', username: '', requestStageId: 2 }]
    // this._stageS.getAllRequestStages(this.pageNumber, this.pageSize).subscribe((res) => {
    //   this.reqStageItems = res.data;
    //   this.totalPages=res.totalPages;
    //   this.totalRecords=res.totalRecords;

    // })
  }
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getStages();
    }
  }
  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getStages();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getStages();
    }
  }
  assignUser(id) {

    console.log("assignUser", id);
    this.currentId = id;
    this._dDS.getEmployeesForDD().subscribe((res) => {
      this.users = res.data;
    })
  }
  editStage(id: number) {
    this.currentId = id;
    this._dDS.getEmployeesForDD().subscribe((res) => {
      this.users = res.data;
    })
  }
  get rSF() {
    return this.reqStageForm.controls
  }
  submitForm() {


    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.reqStageForm)
      const data = {
        requestStageId: this.currentId,
        requester: '',
        status: '',
        description: '',
        requesterTeam: '',
        approver: '',
        approverId: 0,
        requestTableId: 0
      }
      this._stageS.updateRequestStages(data).subscribe((res) => {
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, toastHeading: "Updated", toastParagrahp: "Request Stage Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/request-stages']);
          this._toastS.hide();
        }

      }, (error: any) => {
        console.error("Login error:", error);
        //this.toast.error("An error occurred", "Error", { positionClass: 'toast-bottom-left' });
      })
    }
    else {
      const data = {
        stageId: 0,
        // name: this.stageForm.get('name').value,
        // description: this.stageForm.get('description').value,
        // workFlowId:this.stageForm.get('workFlowId').value,
        // userId:localStorage.getItem('userId')
      }
      this._stageS.createStage(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, toastHeading: "Added", toastParagrahp: "Stage Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/stages']);
          this._toastS.hide();
        }
      }, (error: any) => {
        console.error("Login error:", error);
        //this.toast.error("An error occurred", "Error", { positionClass: 'toast-bottom-left' });
      })
    }
  }
  deleteStage(id: any) {
    
    this._stageS.deleteStage(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const stages = this.reqStageItems.filter((item: any) => item.stageId !== id);
        // this.reqStageItems = stages;
        this.getStages();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Stage Deleted Successfully!" }
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
}

