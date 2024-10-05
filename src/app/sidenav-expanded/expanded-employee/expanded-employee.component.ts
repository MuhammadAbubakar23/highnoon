import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';


declare var toggleNavPanel: any;
@Component({
  selector: 'expanded-app-employee',
  templateUrl: './expanded-employee.component.html',
  styleUrls: ['./expanded-employee.component.css']
})

export class ExpandedEmployeeComponent implements OnInit {
  headerTitle = "Self services"
  subMenus = [
    {
      "DisplayName": "My Information",
      "RouteName": "/connect/employee-self-services/my-information"
    },
    {
      "DisplayName": "My Leave",
      "RouteName": "/connect/employee-self-services/my-leave"
    },
    {
      "DisplayName": "Attendance",
      "RouteName": "/connect/employee-self-services/attendance"
    },
    {
      "DisplayName": "Business Travel",
      "RouteName": "/connect/employee-self-services/businesstravel"
    },
    {
      "DisplayName": "Pay Slip",
      "RouteName": "/connect/employee-self-services/pay-slip"
    },
    {
      "DisplayName": "Loans",
      "RouteName": "/connect/employee-self-services/loans"
    },
    {
      "DisplayName": "Provident Fund Statement",
      "RouteName": "/connect/employee-self-services/provident-fund"
    },
    {
      "DisplayName": "Income Tax Slip",
      "RouteName": "/connect/employee-self-services/income-tax"
    },
    {
      "DisplayName": "Overtime Request",
      "RouteName": "/connect/employee-self-services/overtime-request"
    },
    {
      "DisplayName": "HR Policies",
      "RouteName": "/connect/employee-self-services/hr-articles"
    },
    {
      "DisplayName": "Benefits",
      "RouteName": "/connect/employee-self-services/benefits"
    }
  ];

  activeIndex = 0;
  isActive = false;
  activeMenu(index) {
    this.activeIndex = index;
    this.isActive = true;
  }
  public activeTab;

  constructor(private router: Router ,private _sideNavS:SidenavService) {
    console.log(this.router.url);
  }
  ngAfteContentInit(): void {

  }


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
