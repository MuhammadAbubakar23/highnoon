import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { DropDownApiService } from 'src/app/shared/services/drop-down-api.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  startDate = "";
  endDate = "";
  constructor(private datePipe: DatePipe, private _toastS: ToasterService, private _dropdownS: DropDownApiService,
    private _hS: HeaderService) {

    _hS.updateHeaderData({
      title: 'Activities',
      icon: '<i class="fa-light fa-file-lines"></i>',
      tabs: [{ title: '', url: '/connect/dashborad/activities' }],
      isTab: false,
    })
  }
  ngOnInit(): void {
    this.getCurrentMonthDateFormatted();
  }
  getCurrentMonthDateFormatted() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const parsedstartDate = new Date(startOfMonth);
    const parsedendDate = new Date(endOfMonth);
    this.startDate = this.datePipe.transform(parsedstartDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(parsedendDate, 'yyyy-MM-dd');
  }

}
