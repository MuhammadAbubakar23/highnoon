import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-manage-articles',
  templateUrl: './manage-articles.component.html',
  styleUrls: ['./manage-articles.component.css']
})
export class ManageArticlesComponent {
  constructor(private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'HR Articles',
      tabs: [],
      isTab: false,
    })
  }
}
