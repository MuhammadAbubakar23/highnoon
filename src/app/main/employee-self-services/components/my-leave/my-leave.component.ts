import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-my-leave',
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.css']
})
export class MyLeaveComponent {
  constructor(private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'Leaves',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }

}
