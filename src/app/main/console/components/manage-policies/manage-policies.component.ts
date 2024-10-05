import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-manage-policies',
  templateUrl: './manage-policies.component.html',
  styleUrls: ['./manage-policies.component.css']
})
export class ManagePoliciesComponent {
  constructor(private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'HR Policies',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

  }
}
