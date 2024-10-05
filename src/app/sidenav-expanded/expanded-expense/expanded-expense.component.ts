import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var toggleNavPanel: any;
@Component({
  selector: 'app-expanded-expense',
  templateUrl: './expanded-expense.component.html',
  styleUrls: ['./expanded-expense.component.css']
})
export class ExpandedExpenseComponent implements OnInit{
  headerTitle = "Expense"
  subMenus: any = [
    {
      "DisplayName": "Business Travel Requisition",
      "RouteName": "/connect/expense/businesstravelrequisition"
    },
    {
      "DisplayName": "Business Travel Reimbursement",
      "RouteName": "/connect/expense/businesstravelreimbursement"
    },
    {
      "DisplayName": "OPD Medical Expense",
      "RouteName": "/connect/expense/opdmedical"
    },
    {
      "DisplayName": "Reimbursement",
      "RouteName": "/connect/expense/reimbursement"
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
