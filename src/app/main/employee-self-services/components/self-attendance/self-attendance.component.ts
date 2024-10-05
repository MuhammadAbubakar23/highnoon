import { Component } from '@angular/core';

import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-self-attendance',
  templateUrl: './self-attendance.component.html',
  styleUrls: ['./self-attendance.component.css']
})
export class SelfAttendanceComponent {

  constructor(private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'Attendance',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    console.log();
  }


}

