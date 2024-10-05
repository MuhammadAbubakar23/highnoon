import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent {
  currentId: any = 0;
  departments = [];
  teamForm = new FormGroup({
    teamName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    departmentId: new FormControl(0)
  });


  constructor(private _teamS: TeamService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  ngOnInit(): void {
    this.getTeamDetails();
  }
  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Teams',
        tabs: [{ title: 'Create', url: 'connect/console/create-team', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Teams',
        tabs: [{ title: 'Update', url: 'connect/console/update-team', isActive: true }],
        isTab: false,
      })
    }
  }
  getTeamDetails() {
    this._aR.params.subscribe((params) => {
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update')
        this._teamS.getTeamById(this.currentId).subscribe((res) => {

          this.teamForm.patchValue({
            teamName: res.data.teamName,
            departmentId: res.data.departmentId
          })
        })
      }

      this._DDS.getDepartmentsForDD().subscribe((res) => {

        this.departments = res.data;
      })

    })
  }
  get tF() {
    return this.teamForm.controls
  }


  submitForm() {


    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.teamForm)
      const data = {
        id: this.currentId,
        teamName: this.teamForm.get('teamName').value,
        departmentId: this.teamForm.get('departmentId').value,
      }
      this._teamS.updateTeam(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Team Updated Successfully!" }
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
    else {

      const data = {
        id: 0,
        teamName: this.teamForm.get('teamName').value,
        departmentId: this.teamForm.get('departmentId').value,
      }
      this._teamS.createTeam(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Teams Added Successfully!" }
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
