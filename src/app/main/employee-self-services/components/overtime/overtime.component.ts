import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
@Component({
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.css']
})
export class OvertimeComponent implements OnInit {

  constructor(private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'Overtime Requests',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }

  
  ngOnInit(): void {
  }

}
