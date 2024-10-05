import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toggleNavPanel: any;
@Component({
  selector: 'expanded-app-dashborad',
  templateUrl: './expanded-dashborad.component.html',
  styleUrls: ['./expanded-dashborad.component.css']
})
export class ExpandeddashboradComponent implements OnInit {
  headerTitle = "Dashboard"
  subMenus: any = [
    {
      "DisplayName": "My Dashboard",
      "RouteName": "/connect/dashborad/my-dashboard"
    },
    {
      "DisplayName": "Calendar",
      "RouteName": "/connect/dashborad/calendar"
    },
    {
      "DisplayName": "Task",
      "RouteName": "/connect/dashborad/task"
    },
    {
      "DisplayName": "Activities",
      "RouteName": "/connect/dashborad/activities"
    }
  ];

  activeIndex = 0;
  isActive = false;
  activeMenu(index) {
    this.activeIndex = index;
    this.isActive = true;
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setActiveIndexBasedOnCurrentUrl();
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
