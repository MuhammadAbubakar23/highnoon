import { Component } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-manage-employee-role',
  templateUrl: './manage-employee-role.component.html',
  styleUrls: ['./manage-employee-role.component.css']
})
export class ManageEmployeeRoleComponent {
  currentId: any = 0;
  roles: any = [];
  isDisabled: boolean = true;
  selectedRoles: any = [];
  manageEmployeeRoleForm = new FormGroup({
    employeeName: new FormControl('', [Validators.required]),
    selectedRoles: new FormControl([])
  });
  constructor(private _rolesS: RolesService, private _empS: EmployeeService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'Roles',
      tabs: [{ title: 'Manage Employee Role', url: 'connect/console/manage-employee-role', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this._aR.params.subscribe((params) => {

      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this._empS.getEmployeeById(this.currentId).subscribe((res) => {
          this.manageEmployeeRoleForm.patchValue({
            employeeName: res.data.firstName,
          })
        })
      }
    })
    this._rolesS.getRolesByUserId(this.currentId).subscribe((res) => {
      this.roles = res.data;
      this.manageEmployeeRoleForm.patchValue({ selectedRoles: this.roles.filter(role => role.isSelected) })
    })
  }

  get erF() {
    return this.manageEmployeeRoleForm.controls
  }
  submitForm() {
    let selectedRoles = this.manageEmployeeRoleForm.get('selectedRoles').value;
    const finalRoles = [];
    selectedRoles.forEach(element => {
      element.userId = Number(this.currentId);
      delete element.isSelected;
      finalRoles.push(element);
    });
    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = finalRoles;
      this._rolesS.addEmployRole(data).subscribe((res) => {

        if (res.statusCode === 200) {
          const toasterObject = { isShown: true,isSuccess:true, toastHeading: "Updated", toastParagrahp: "Employee Role Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/employees']);
          this._toastS.hide();
        }

      }, (error: any) => {
        console.error("Internal Server Error", error);
        const toasterObject = { isShown: true,isSuccess:false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        this._toastS.updateToastData(toasterObject)
        this._toastS.hide();
      })
    }
    // else {
    //   console.log("this.selected", this.selectedRoles)
    //   const data = {
    //     roleId: 0,
    //     roleName: this.selectedRoles,
    //     userId: this.currentId
    //   }
    //   this._rolesS.addEmployRole(data).subscribe((res) => {
    //     console.log(res)
    //     if (res.statusCode === 200) {
    //       const toasterObject = { isShown: true, toastHeading: "Added", toastParagrahp: "Employee Role Added Successfully!" }
    //       this._toastS.updateToastData(toasterObject)
    //       this._r.navigate(['/connect/console/employers']);

    //     }
    //   }, (error: any) => {
    //     console.error("Login error:", error);
    //     //this.toast.error("An error occurred", "Error", { positionClass: 'toast-bottom-left' });
    //   })
    // }
  }
}


