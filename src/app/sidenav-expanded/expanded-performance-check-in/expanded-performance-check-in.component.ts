import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare let toggleNavPanel;

@Component({
  selector: 'app-expanded-performance-check-in',
  templateUrl: './expanded-performance-check-in.component.html',
  styleUrls: ['./expanded-performance-check-in.component.css']
})
export class ExpandedPerformanceCheckInComponent  implements OnInit {
  customVal: string[] = [];
  currentParent: any = {};
  headerTitle="Performance Check-in"
  subMenus: any = [
    {
    "DisplayName": "Performance Evaluation",
    "RouteName": "/connect/performance-check-in"
    }
  ];
  activeIndex = 0;
  isActive = false;
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.setActiveIndexBasedOnCurrentUrl();
  }
  // getMenus() {
  //   let menus = JSON.parse(localStorage.getItem('Menus'));
  //   console.log("Menus", menus);
  //   const parentMenus = menus.filter((item) => item.ParentId === null);
  //   this.currentParent = parentMenus.find((item) => item.Name === 'Leaves')
  //   this.subMenus = menus.filter((item) => item.ParentId === this.currentParent.MenuId)

  // }
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
