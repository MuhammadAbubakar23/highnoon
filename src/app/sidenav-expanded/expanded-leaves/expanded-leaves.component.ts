import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
declare var toggleNavPanel;

@Component({
  selector: 'expanded-app-leaves',
  templateUrl: './expanded-leaves.component.html',
  styleUrls: ['./expanded-leaves.component.css']
})
export class ExpandedLeavesComponent implements OnInit {
  customVal: string[] = []
  currentParent: any = {};
  headerTitle = "Leaves"

  subMenus = [
    {
      "DisplayName": "My Leaves",
      "RouteName": "/connect/leaves"
    },
    {
      "DisplayName": "Leaves Requests",
      "RouteName": "/connect/leaves/encashment",
      "expanded": false,
      "isChild":true,
      "Children": [
        {
          "DisplayName": "Encashment",
          "RouteName": "/connect/leaves/encashment"
        },
        {
          "DisplayName": "Accruals",
          "RouteName": "/connect/leaves/accruals"
        },
        {
          "DisplayName": "LFA Amount",
          "RouteName": "/connect/leaves/lfa-amount"
        }
      ]
    }
  ];


  isCollapsed: boolean[] = [];



  toggleCollapse(menu: any) {
    menu.expanded = !menu.expanded;
}



  activeIndex = 0;
  isActive = false;
  constructor(private _menuS: MenuPermissionService, private router: Router) {
    this.isCollapsed = new Array(this.subMenus.length).fill(false);
  }

  ngOnInit(): void {
    //this.getMenus();
    //this.setActiveIndexBasedOnCurrentUrl();
  }

  // setActiveIndexBasedOnCurrentUrl() {

  //   const currentUrl = this.router.url;
  //   for( let j = 0; j < this.subMenus.length; j++ ){
  //     if(currentUrl===this.subMenus[j].RouteName){
  //       this.activeIndex = j;
  //       if(this.subMenus[j].Children){
  //         for(let i = 0 ; i < this.subMenus[j].Children.length; i++){
  //           if(currentUrl === this.subMenus[j].Children[i].RouteName){
  //             this.activeIndex = i;
  //             break
  //           }
  //         }
  //       }

  //     }
  //   }

  // }
  getMenus() {
    let menus = JSON.parse(localStorage.getItem('Menus'));
    const parentMenus = menus.filter((item) => item.ParentId === null);
    this.currentParent = parentMenus.find((item) => item.Name === 'Leaves')
    this.subMenus = menus.filter((item) => item.ParentId === this.currentParent.MenuId)
  }
  activeMenu(index) {
    this.activeIndex = index;
    this.isActive = true;
  }
  toggle() {
    ;
  }

  toggleNavTest() {
    toggleNavPanel();
  }
}
