import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { TeamService } from '../../services/team.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-manage-approval',
  templateUrl: './manage-approval.component.html',
  styleUrls: ['./manage-approval.component.css']
})
export class ManageApprovalComponent {
  currentId: any = 0;
  users: any = [];
  isDisabled: boolean = true;
  selectedApprovals: any = [];
  ApprovalForm = new FormGroup({
    teamName: new FormControl('', [Validators.required]),
    teamId: new FormControl('', [Validators.required]),
    selectedApprovals: new FormControl([])
  });
  constructor(private _teamS: TeamService, private _empS: EmployeeService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'Teams',
      tabs: [{ title: 'Manage Approval', url: 'connect/console/manage-approval', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this._aR.params.subscribe((params) => {
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this._teamS.getTeamById(this.currentId).subscribe((res) => {
          this.ApprovalForm.patchValue(res.data)
        })

      }
    })

    this._teamS.getApproversByTeamId(this.currentId).subscribe((res) => {
      this.users = res.data;
      this.ApprovalForm.patchValue({ selectedApprovals: this.users.filter(role => role.isSelected) })
    })
  }

  get erF() {
    return this.ApprovalForm.controls
  }
  submitForm() {

    let selectedApprovals = this.ApprovalForm.get('selectedApprovals').value;
    const finalApprovals = [];
    selectedApprovals.forEach(element => {
      element.teamId = this.currentId;
      element.userId = element.userId
      delete element.isSelected;
      delete element.userName
      finalApprovals.push(element);
    });
    if (this.currentId !== 0 && this.currentId !== undefined) {
      //const data = finalApprovals;
      const formValues = this.ApprovalForm.value;
      const data = {
        "teamId": formValues["teamId"],
        "teamApproversList": finalApprovals
      }
      this._teamS.addTeamApproves(data).subscribe((res) => {

        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Employee Role Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/teams']);
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
}


