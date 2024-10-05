import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { RolesService } from '../../services/roles.service';
@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent {

  currentId: any = 0;
  roleId: any = 0;
  departments = [];
  permissions: any = []
  permissions1: any = [];
  selectedPermissions: any = [];
  roleForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  });
  isUpdate: boolean = false;
  constructor(private _rolesS: RolesService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  ngOnInit(): void {
    this.getRoleDetails();
  }

  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Roles',
        tabs: [{ title: 'Create', url: 'connect/console/create-role', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Roles',
        tabs: [{ title: 'Update', url: 'connect/console/update-role', isActive: true }],
        isTab: false,
      })
    }
  }
  getRoleDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update');
        this.isUpdate = true;
        this._rolesS.getRoleById(this.currentId).subscribe((res) => {

          this.roleForm.patchValue({
            name: res.data.name,
          })
        })
        this._rolesS.getPermissionsByRoleId(this.currentId).subscribe((res) => {
          
          this.permissions = res.data;
          this.permissions1 = this.permissions.filter(item => item.parentId == null);
          this.permissions1.forEach((item: any) => {
            item.childs = this.permissions.filter((a) => a.parentId === item.permissionId)
          })
        })

      }
    })
  }
  get rF() {
    return this.roleForm.controls
  }
  checkParent(parentIndex: number): void {
    const parent = this.permissions1[parentIndex];
    parent.isChecked = !parent.isChecked;
    for (const child of parent.childs) {
      child.isChecked = parent.isChecked;
    }
  }
  checkChild(parentIndex: number, childIndex: number): void {
    const parent = this.permissions1[parentIndex];
    const child = parent.childs[childIndex];
    child.isChecked = !child.isChecked;
    const allChildrenChecked = parent.childs.every((child) => child.isChecked);
    parent.isChecked = allChildrenChecked;
  }
  checkMinusSquare(parent: any): boolean {
    const checkedChildren = parent.childs.filter((child) => child.isChecked);
    return checkedChildren.length > 0 && checkedChildren.length < parent.childs.length;
  }

  flattenArray(arr: any[]): any[] {
    
    const result: any[] = [];
    for (const item of arr) {
      const flattenedItem = {
        permissionId: item.permissionId,
        name: item.name,
        slug: item.slug,
        description: item.description,
        parentId: item.parentId,
        isChecked: item.isChecked,
        roleId: item.roleId,
      };
      if (item.childs && item.childs.length > 0) {
        const flattenedChildren = this.flattenArray(item.childs);
        flattenedItem.isChecked = flattenedChildren.some(child => child.isChecked);
        result.push(flattenedItem, ...flattenedChildren);
      } else {
        result.push(flattenedItem);
      }
    }
    return result;
  }
  submitForm() {

    if (this.currentId !== 0 && this.currentId !== undefined) {
      const data = {
        roleId: this.currentId,
        name: this.roleForm.get('name').value,
      }
      // const data = flattenedArray
      this._rolesS.updateRole(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          
          this.selectedPermissions = this.flattenArray(this.permissions1);

          console.log("Selected Permissions", this.selectedPermissions)
          this._rolesS.addPermissionForRole(this.selectedPermissions).subscribe((res) => {
            if (res.statusCode === 200) {
              const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Role Updated Successfully!" }
              this._toastS.updateToastData(toasterObject)
              this._r.navigate(['/connect/console/roles']);
              this._toastS.hide();
            }
          })

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
        roleId: 0,
        name: this.roleForm.get('name').value,
      }
      this._rolesS.createRole(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Roles Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/roles']);
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
