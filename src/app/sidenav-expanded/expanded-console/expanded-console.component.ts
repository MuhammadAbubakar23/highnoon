import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
declare var toggleNavPanel: any;
@Component({
  selector: 'expanded-app-console',
  templateUrl: './expanded-console.component.html',
  styleUrls: ['./expanded-console.component.css']
})
export class ExpandedConsoleComponent {
  public activeTab;

  activeIndex = 0;
  isActive = false;
  headerTitle = "Console"

  subMenus = [
    {
      "DisplayName": "Benefits",
      "RouteName": "/connect/console/available-medicine",
      "expanded": false,
      "isChild":true,
      "Children": [
        { "DisplayName": "Available Medicine", "RouteName": "/connect/console/available-medicine" },
        { "DisplayName": "Benefit Availablity", "RouteName": "/connect/console/benefit-availability" },
        { "DisplayName": "Benefit Types", "RouteName": "/connect/console/benefit-type" },
        { "DisplayName": "Designation Subsidy", "RouteName": "/connect/console/designation-subsidy" },
      ]
    },
    {
      "DisplayName": "Employees",
       "RouteName": "/connect/console/employees",
       "expanded": false,
       "isChild":true,
      "Children": [
        { "DisplayName": "Employees", "RouteName": "/connect/console/employees" },
        { "DisplayName": "Teams", "RouteName": "/connect/console/teams" },
        { "DisplayName": "Roles", "RouteName": "/connect/console/roles" },
        { "DisplayName": "Permissions", "RouteName": "/connect/console/permissions" },
      ]
    },
    {
      "DisplayName": "Locations", "RouteName": "/connect/console/locations",
      "expanded": false,
      "isChild":true,
      "Children": [
        { "DisplayName": "Locations", "RouteName": "/connect/console/locations" },
        { "DisplayName": "Countries", "RouteName": "/connect/console/countries" },
        { "DisplayName": "States", "RouteName": "/connect/console/states" },
        { "DisplayName": "Cities", "RouteName": "/connect/console/cities" },

      ]
    },
    {
      "DisplayName": "Policies", "RouteName": "/connect/console/policies-articles",
      "expanded": false,
      "isChild":true,
      "Children": [
        { "DisplayName": "Policies Articles", "RouteName": "/connect/console/policies-articles" },
        { "DisplayName": "Policies Documents", "RouteName": "/connect/console/policies-documents" },

      ]
    },
    {
      "DisplayName": "Travel", "RouteName": "/connect/console/currency-types",
      "expanded": false,
      "isChild":true,
      "Children": [
        { "DisplayName": "Currency Types", "RouteName": "/connect/console/currency-types" },
        { "DisplayName": "Expense Types", "RouteName": "/connect/console/expense-types" },
        { "DisplayName": "Travel Classes", "RouteName": "/connect/console/travel-classes" },
        { "DisplayName": "Travel Preference Time", "RouteName": "/connect/console/travel-preference-time" },
        { "DisplayName": "Travel Types", "RouteName": "/connect/console/travel-types" },

      ]
    },
    {
      "DisplayName": "Workflows", "RouteName": "/connect/console/workflows",
      "expanded": false,
      "isChild":true,
      "Children": [
        { "DisplayName": "Workflows", "RouteName": "/connect/console/workflows" },
        { "DisplayName": "Stages", "RouteName": "/connect/console/stages" }

      ]
    },
    { "DisplayName": "Bulletin", "RouteName": "/connect/console/bulletin" },
    { "DisplayName": "Schedule", "RouteName": "/connect/console/schedule" },
    { "DisplayName": "Important Links", "RouteName": "/connect/console/important-links" },
    { "DisplayName": "Leave Type", "RouteName": "/connect/console/leave-type" },
    { "DisplayName": "Loan Type", "RouteName": "/connect/console/loan-type" },
  ];



  // subMenus = [
  //   {"DisplayName":"Categories","RouteName":"/connect/console/categories"},
  //   {"DisplayName":"Designations","RouteName":"/connect/console/designations"},
  //   {"DisplayName":"Departments","RouteName":"/connect/console/departments"},
  //   {"DisplayName":"EmployeeType","RouteName":"/connect/console/employee-type"},


  //   {"DisplayName":"Menu","RouteName":"/connect/console/menu"},

  //   {"DisplayName":"Employer","RouteName":"/connect/console/employer"},
  //   {"DisplayName":"Job Title","RouteName":"/connect/console/job-title"},


  // ];

  constructor() {
  }
  toggleCollapse(menu: any) {
      menu.expanded = !menu.expanded;
  }

  ngOnInit(): void {

  }
  // activeMenu(index) {
  //   this.activeIndex = index;
  //   this.isActive = true;
  // }
  toggle() {
    ;
  }

  toggleNavTest() {
    toggleNavPanel();
  }
}


