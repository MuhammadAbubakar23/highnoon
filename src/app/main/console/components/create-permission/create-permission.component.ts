import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';
import { TeamService } from '../../services/team.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-create-permission',
  templateUrl: './create-permission.component.html',
  styleUrls: ['./create-permission.component.css']
})
export class CreatePermissionComponent {
  currentId: any = 0;
  parents = [];
  permissionForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    slug: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    parentId: new FormControl(null)
  });


  constructor(private _permissionS: PermissionService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    this.changeHeader('create');
  }
  ngOnInit(): void {
    this.getPermissionDetails();
  }
  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Permission',
        tabs: [{ title: 'Create', url: 'connect/console/create-permission', isActive: true }],
        isTab: false,
      })

    }
    else {
      this._hS.updateHeaderData({
        title: 'Permission',
        tabs: [{ title: 'Update', url: 'connect/console/update-permission', isActive: true }],
        isTab: false,
      })
    }
  }
  getPermissionDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update');
        this._permissionS.getPermissionById(this.currentId).subscribe((res) => {
          this.permissionForm.patchValue({
            name: res.data.name,
            slug: res.data.slug,
            description: res.data.description,
            parentId: res.data.parentId
          })
        })
      }

      this._DDS.getParentPermissionsForDD().subscribe((res) => {
        this.parents = res.data;
      })
    })
  }
  get pF() {
    return this.permissionForm.controls
  }


  submitForm() {
    

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.permissionForm)
      const data = {
        permissionId: this.currentId,
        name: this.permissionForm.get('name').value,
        slug: this.permissionForm.get('slug').value,
        description: this.permissionForm.get('description').value,
        parentId: this.permissionForm.get('parentId').value
      }
      this._permissionS.updatePermission(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Permission Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/permissions']);

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
        permissionId: this.currentId,
        name: this.permissionForm.get('name').value,
        slug: this.permissionForm.get('slug').value,
        description: this.permissionForm.get('description').value,
        parentId: this.permissionForm.get('parentId').value
        // isActive: this.permissionForm.get('isActive').value
      }
      this._permissionS.createPermission(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Permission Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/permissions']);

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
