import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
massage:string[]=["calendar","","","","","","","","fa-light fa-file-lines",""]
 currentDate: Date = new Date();
  currentMonth: Date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
  daysInWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  constructor(

  ) { }

  ngOnInit(): void {


  }

}
