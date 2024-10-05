import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-businesstravel',
  templateUrl: './businesstravel.component.html',
  styleUrls: ['./businesstravel.component.css']
})
export class BusinesstravelComponent {

  constructor(private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'Business Travel',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })
  }


}
