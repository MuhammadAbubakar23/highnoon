import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.css']
})
export class CreateMenuComponent {
  currentId: any = 0;
  parents = [];
  permissions = [];
  menuForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    displayName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    routeName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    icon: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    parentId: new FormControl(null),
    permissionId: new FormControl(0, [Validators.required, Validators.maxLength(100)]),
  });


  constructor(private _menuS: MenuService, private _aR: ActivatedRoute, private _r: Router, private _toastS: ToasterService, private _DDS: DropDownApiService, private _hS: HeaderService) {
    this.changeHeader('create');


  }
  ngOnInit(): void {
    this._DDS.getPermissionsForDD().subscribe((res) => {
      this.permissions = res.data;
    })
    this._DDS.getParentMenusForDD().subscribe((res) => {
      this.parents = res.data;
    })
    this.getMenuDetails();
  }

  changeHeader(title: string) {
    if (title === 'create') {
      this._hS.updateHeaderData({
        title: 'Menu',
        tabs: [{ title: 'Create', url: 'connect/console/create-menu', isActive: true }],
        isTab: false,
      })
    }
    else {
      this._hS.updateHeaderData({
        title: 'Menu',
        tabs: [{ title: 'Update', url: 'connect/console/update-menu', isActive: true }],
        isTab: false,
      })
    }
  }
  getMenuDetails() {
    this._aR.params.subscribe((params) => {
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this.changeHeader('update');
        this._menuS.getMenuById(this.currentId).subscribe((res) => {
          this.menuForm.patchValue({
            name: res.data.name,
            displayName: res.data.displayName,
            description: res.data.description,
            routeName: res.data.routeName,
            icon: res.data.icon,
            parentId: res.data.parentId,
            permissionId: res.data.permissionId
          })
        })
      }

    })
  }
  get mF() {
    return this.menuForm.controls
  }
  submitForm() {
    

    // let parentId = this.menuForm.get('parentId').value;
    // if (parentId === 0) {
    //   parentId = null;
    // }

    if (this.currentId !== 0 && this.currentId !== undefined) {
      console.log(this.menuForm)
      const data = {
        menuId: this.currentId,
        name: this.menuForm.get('name').value,
        displayName: this.menuForm.get('displayName').value,
        description: this.menuForm.get('description').value,
        routeName: this.menuForm.get('routeName').value,
        icon: this.menuForm.get('icon').value,
        parentId: this.menuForm.get('parentId').value,
        permissionId: this.menuForm.get('permissionId').value

      }
      this._menuS.updateMenu(data).subscribe((res) => {

        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Updated", toastParagrahp: "Menu Updated Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/menu']);
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
        menuId: 0,
        name: this.menuForm.get('name').value,
        displayName: this.menuForm.get('displayName').value,
        description: this.menuForm.get('description').value,
        routeName: this.menuForm.get('routeName').value,
        icon: this.menuForm.get('icon').value,
        parentId: this.menuForm.get('parentId').value,
        permissionId: this.menuForm.get('permissionId').value,
      }
      this._menuS.createMenu(data).subscribe((res) => {
        console.log(res)
        if (res.statusCode === 200) {
          const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Added", toastParagrahp: "Menu Added Successfully!" }
          this._toastS.updateToastData(toasterObject)
          this._r.navigate(['/connect/console/menu']);
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

