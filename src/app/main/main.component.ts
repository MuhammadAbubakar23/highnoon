import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidenavService } from 'src/app/services/sidenav.service';
import { ExpendedAttendanceComponent } from 'src/app/sidenav-expanded/expanded-attendance/expanded-attendance.component';
import { ExpandedEmployeeComponent } from 'src/app/sidenav-expanded/expanded-employee/expanded-employee.component';
import { ExpandeddashboradComponent } from 'src/app/sidenav-expanded/expanded-dashborad/expanded-dashborad.component';
import { ExpandedLeavesComponent } from 'src/app/sidenav-expanded/expanded-leaves/expanded-leaves.component';
import { ExpandedConsoleComponent } from '../sidenav-expanded/expanded-console/expanded-console.component';
import { Router } from '@angular/router';
import { ExpandedExpenseComponent } from '../sidenav-expanded/expanded-expense/expanded-expense.component';
import { ExpandedPerformanceCheckInComponent } from '../sidenav-expanded/expanded-performance-check-in/expanded-performance-check-in.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  public subscription!: Subscription;

  @ViewChild('container', { read: ViewContainerRef }) target: ViewContainerRef | undefined;
  componentName!: string;

  constructor(
    private resolver: ComponentFactoryResolver,
    private sidenavService: SidenavService,
    private router: Router
  ) {
    this.updateSidenav();
  }

  updateSidenav() {
    const urlSegments = this.router.url.split('/');
    let moduleSegment = urlSegments[2];
    console.log("Sidenav", moduleSegment)
    switch (moduleSegment) {
      case 'dashborad':
        moduleSegment = 'Dashboard'
        break;
      case 'employee-self-services':
        moduleSegment = 'Employee Self Service'
        break;
      case 'attendance':
        moduleSegment = 'Attendance'
        break;
      case 'performance-check-in':
        moduleSegment = 'Performance Check-in'
        break;        
      case 'leaves':
        moduleSegment = 'Leaves'
        break;
      case 'expense':
        moduleSegment = 'Expense'
        break;
      case 'console':
        moduleSegment = 'Console'
        break;
    }
    this.sidenavService.updateMessage(moduleSegment);
  }

  ngOnInit(): void {
    this.sidenavService.getMessage.subscribe((msg: string) => {
      this.componentName = msg;
      this.target?.clear();
      this.loadComponent(this.componentName);
    });
  }

  ngAfterViewInit(): void {
    this.loadComponent(this.componentName);
  }

  loadComponent(leftSideName: string): void {
    let componentFactory = null;

    switch (leftSideName) {
      case 'Dashboard':
        componentFactory = this.resolver.resolveComponentFactory(ExpandeddashboradComponent);
        break;
      case 'Employee Self Service':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedEmployeeComponent);
        break;
      case 'Attendance':
        componentFactory = this.resolver.resolveComponentFactory(ExpendedAttendanceComponent);
        break;
      case 'Performance Check-in':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedPerformanceCheckInComponent);
        break;        
      case 'Leaves':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedLeavesComponent);
        break;
      case 'Expense':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedExpenseComponent);
        break;
      case 'Console':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedConsoleComponent);
        break;
      default:
        componentFactory = this.resolver.resolveComponentFactory(ExpandedEmployeeComponent);
        break;
    }

    if (componentFactory && this.target) {
      this.target.createComponent(componentFactory);
    }
  }
}
