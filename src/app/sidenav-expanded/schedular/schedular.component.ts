import { Component, OnInit } from '@angular/core';
declare var toggleNavPanel: any;
@Component({
  selector: 'app-schedular',
  templateUrl: './schedular.component.html',
  styleUrls: ['./schedular.component.css']
})
export class SchedularComponent implements OnInit {
  customVal: string[] = []
  constructor() { }

  ngOnInit(): void {
    this.customVal = ["Schedular", "Summary","My Requests"]
  }
  toggle() {
    ;
  }
  toggleNavTest() {
    toggleNavPanel();
  }
}
