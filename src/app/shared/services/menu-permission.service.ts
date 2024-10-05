import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuPermissionService {
  private permissions: any = [];
  constructor() {

  }
  hasPermission(name: string): boolean[] {
    
    this.permissions = JSON.parse(localStorage.getItem('Permissions'));
    const foundPermission = this.permissions.find(permission => permission.Name === name);
    return !!foundPermission && foundPermission.IsChecked;
    // return names.map((name) => {
    //   const foundPermission = this.permissions.find(permission => permission.Name === name);
    //   return !!foundPermission && foundPermission.IsChecked;
    // });
  }


}
