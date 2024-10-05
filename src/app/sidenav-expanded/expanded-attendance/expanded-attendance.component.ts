import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare let toggleNavPanel;
@Component({
  selector: 'expended-app-attendance',
  templateUrl: './expanded-attendance.component.html',
  styleUrls: ['./expanded-attendance.component.css']
})
export class ExpendedAttendanceComponent implements OnInit {
  customVal: string[] = [];
  currentParent: any = {};
  headerTitle="Attendance"
  subMenus: any = [
    {
    "DisplayName": "Attendance",
    "RouteName": "/connect/attendance"
  },
  {
    "DisplayName": "Roster",
    "RouteName": "/connect/attendance/roster"
  },
  {
    "DisplayName": "Overtime Management",
    "RouteName": "/connect/attendance/overtime"
  }
];
  activeIndex = 0;
  isActive = false;
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.setActiveIndexBasedOnCurrentUrl();
  }
  getMenus() {
    let menus = JSON.parse(localStorage.getItem('Menus'));
    console.log("Menus", menus);
    const parentMenus = menus.filter((item) => item.ParentId === null);
    this.currentParent = parentMenus.find((item) => item.Name === 'Leaves')
    this.subMenus = menus.filter((item) => item.ParentId === this.currentParent.MenuId)

  }
  activeMenu(index) {
    this.activeIndex = index;
    this.isActive = true;
  }
  setActiveIndexBasedOnCurrentUrl() {
    
    const currentUrl = this.router.url;
    for (let i = 0; i < this.subMenus.length; i++) {
      if (currentUrl === this.subMenus[i].RouteName) {
        this.activeIndex = i;
        break;
      }
    }
  }
  toggle() {
    ;
  }

  toggleNavTest() {
    toggleNavPanel();
  }

}
