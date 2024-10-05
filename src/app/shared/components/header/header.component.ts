import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/authService/auth.service';
import { DesignationService } from 'src/app/main/console/services/designation.service';
import { EmployeeService } from 'src/app/main/console/services/employee.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username = "";
 initial=""

  designation = "";
  Manager: any;
  headerData: any = {
    // title: 'Attendance',
    // tabs:[{title:'My Attendance',url:'connect/attendance', isActive:true},{title:'My Requests',url:'', isActive:false},{title:'Team Requests',url:'', isActive:false}],
    // subtitle: ['My Attendance','My Requests','Team Requests'],
    // isTab: true,
  };
  currentroute: any;
  constructor(private _headerService: HeaderService, private router: Router, private _authS: AuthService, private dS: DesignationService, private _empS: EmployeeService) {
    const urlSegments = this.router.url.split('/');
    const moduleSegment = urlSegments[2];
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.initial=localStorage.getItem('initial');

    this.dS.getDesignationById(localStorage.getItem('designationId')).subscribe((res) => {
      this.designation = res.data.title;
    })
    this._empS.getEmployeeById(Number(localStorage.getItem('userId'))).subscribe((res: any) => {
      this.Manager = res.data;
    })
    this._headerService.currentHeaderData.subscribe(data => {
      this.headerData = data;
      console.log("header Date===>", data)
    });


  }
  signOut() {
    this._authS.doLogout();
  }

  navigateTab(url) {
    this.router.navigateByUrl(url);
  }
}
