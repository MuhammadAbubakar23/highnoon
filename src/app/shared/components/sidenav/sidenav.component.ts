import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  menus = [
    {
      Name: 'Dashboard',
      DisplayName: 'Dashboard',
      RouteName: '/connect/dashborad',
      iconClass: 'fa-light fa-gauge ice'
    },
    {
      Name: 'Employee Self Service',
      DisplayName: 'Employee Self Service',
      RouteName: '/connect/employee-self-services',
      iconClass: 'fa-light fa-address-card ice'
    },
    {
      Name: 'Attendance',
      DisplayName: 'Attendance',
      RouteName: '/connect/attendance',
      iconClass: 'fa-light fa-calendar-star ice'
    },
    {
      Name: 'Leaves',
      DisplayName: 'Leaves',
      RouteName: '/connect/leaves',
      iconClass: 'fa-light fa-calendar-clock ice'
    },
    {
      Name: 'Performance Check-in',
      DisplayName: 'Performance Check-in',
      RouteName: '/connect/performance-check-in',
      iconClass: 'fa-light fa-right-to-bracket ice'
    },
    {
      Name: 'Expense',
      DisplayName: 'Expense',
      RouteName: '/connect/expense',
      iconClass: 'fa-light fa-sack-dollar ice'
    },
    {
      Name: 'Training & Deveopment',
      DisplayName: 'Training & Deveopment',
      // No route provided in the HTML, so no RouteName in the object
      iconClass: 'fa-light fa-chalkboard ice'
    },
    {
      Name: 'Analytics',
      DisplayName: 'Analytics',
      RouteName: '/connect/console/users',
      iconClass: 'fa-light fa-chart-line-up ice'
    },
    {
      Name: 'Console',
      DisplayName: 'Console',
      RouteName: '/connect/console/locations',
      iconClass: 'fal fa-cog ice'
    }
  ];


  activeIndex = 0;
  isActive = false;
  constructor(private sidenavService: SidenavService) { }

  ngOnInit(): void {
  }

  getMenus() {
    let menus = JSON.parse(localStorage.getItem('Menus'));
    this.menus = menus.filter((item) => item.ParentId === null);
  }
  activeMenu(index, name) {
    this.activeIndex = index;
    this.isActive = true;
    this.sidenavService.updateMessage(name);
  }

}

