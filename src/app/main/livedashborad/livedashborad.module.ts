import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LivedashboradRoutingModule } from './livedashborad-routing.module';
import { MyDashboardComponent } from './components/my-dashboard/my-dashboard.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TaskComponent } from './components/task/task.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
@NgModule({
  declarations: [
    CalendarComponent,
    TaskComponent,
    ActivitiesComponent,
    MyDashboardComponent
  ],
  imports: [
    CommonModule,
    LivedashboradRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    DatePipe
  ]
})
export class LivedashboradModule { }
