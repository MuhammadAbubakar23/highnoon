import { Component } from '@angular/core';
import { StageService } from '../../services/stage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-creat-stage',
  templateUrl: './creat-stage.component.html',
  styleUrls: ['./creat-stage.component.css']
})
export class CreatStageComponent {
  currentId: any = 0;
  workflows = [];
  selectedTeam: any;


  teams: any[] = [];
  stageForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    workFlowId: new FormControl(0, [Validators.required, Validators.maxLength(100)]),
    teamId: new FormControl(null),
  });


  constructor(private _stageS: StageService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  ngOnInit(): void {
    this.getStageDetails();
  }

  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'stages',
        tabs: [{ title: 'Create', url: 'connect/console/create-stage', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'stages',
        tabs: [{ title: 'Update', url: 'connect/console/update-stage', isActive: true }],
        isTab: false,
      })
    }
  }
  getStageDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      this._DDS.getWorkFlowsForDD().subscribe((res) => {
        this.workflows = res.data;
      })
      this._DDS.getTeamsForDD().subscribe((res) => {
        this.teams = res.data;
        // this.teams = res.data.map(item => ({
        //   teamId: item.teamId,
        //   teamSlug: item.teamSlug,
        //   teamName: item.teamName
        // }));
        if (this.currentId !== 0 && this.currentId !== undefined) {
          this.changeHeader('update');
          this._stageS.getStageById(this.currentId).subscribe((res) => {
            
            // const selectedTeam = this.teams.find(team => team.teamSlug === res.data.teamSlug && team.teamId === res.data.teamId);
            this.stageForm.patchValue({
              name: res.data.name,
              description: res.data.description,
              workFlowId: res.data.workFlowId,
              teamId: res.data.teamId
            });
            console.log("this.stageForm", this.stageForm.value)
          });

        }
      })

    })
  }
  get sF() {
    return this.stageForm.controls
  }

  submitForm() {

    // let team = this.stageForm.get('teamId').value;
    // const newTeam = {}
    // if (team === null) {
    //   newTeam['teamId'] = null;
    //   newTeam['teamSlug'] = null;
    // }
    // else {
    //   newTeam['teamId'] = this.stageForm.get('teamId').value['teamId'];
    //   newTeam['teamSlug'] = this.stageForm.get('teamId').value['teamSlug'];
    // }
    // console.log("newTeam", newTeam);
    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.stageForm)

      const data = {
        stageId: this.currentId,
        name: this.stageForm.get('name').value,
        description: this.stageForm.get('description').value,
        workFlowId: this.stageForm.get('workFlowId').value,
        teamId: this.stageForm.get('teamId').value,

        //userId: localStorage.getItem('userId')
      }
      this._stageS.updateStage(data).subscribe((res) => {

        if (res.statusCode === 200) {

          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Stage Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/stages']);
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
        stageId: 0,
        name: this.stageForm.get('name').value,
        description: this.stageForm.get('description').value,
        workFlowId: this.stageForm.get('workFlowId').value,
        teamId: this.stageForm.get('teamId').value,
        //userId: localStorage.getItem('userId')
      }
      console.log("Data", data)
      this._stageS.createStage(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Stage Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/stages']);
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

