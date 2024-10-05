import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-self-team-requests',
  templateUrl: './self-team-requests.component.html',
  styleUrls: ['./self-team-requests.component.css']
})
export class SelfTeamRequestsComponent {
  constructor(private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'Leaves',
      tabs: [{ title: 'My Leave', url: 'connect/employee-self-services/my-leave', isActive: false },{ title: 'Team Requests', url: 'connect/employee-self-services/team-requests', isActive: true }],
      isTab: true,
    })
  }
}
