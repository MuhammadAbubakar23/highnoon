import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ExpandedEmployeeComponent } from './sidenav-expanded/expanded-employee/expanded-employee.component';
import { SchedularComponent } from './sidenav-expanded/schedular/schedular.component';
import { ExpandeddashboradComponent } from './sidenav-expanded/expanded-dashborad/expanded-dashborad.component';
import { ExpendedAttendanceComponent } from './sidenav-expanded/expanded-attendance/expanded-attendance.component';
import { ExpandedLeavesComponent } from './sidenav-expanded/expanded-leaves/expanded-leaves.component';
import { ExpandedConsoleComponent } from './sidenav-expanded/expanded-console/expanded-console.component';
import { ExpandedExpenseComponent } from './sidenav-expanded/expanded-expense/expanded-expense.component';


import { NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { ExpandedPerformanceCheckInComponent } from './sidenav-expanded/expanded-performance-check-in/expanded-performance-check-in.component';

@NgModule({
  declarations: [
    AppComponent,
    ExpandedEmployeeComponent,
    SchedularComponent,
    ExpandeddashboradComponent,
    ExpendedAttendanceComponent,
    ExpandedLeavesComponent,
    ExpandedConsoleComponent,
    ExpandedExpenseComponent,
    ExpandedPerformanceCheckInComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,

    NgbOffcanvasModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [

    // {
    //   provide:HTTP_INTERCEPTORS,
    //   useClass:TokenInterceptorService,
    //   multi:true
    // },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
