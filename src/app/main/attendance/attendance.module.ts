import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { AttendanceRequestsComponent } from './components/attendance-requests/attendance-requests.component';
import { AttendanceTeamRequestsComponent } from './components/attendance-team-requests/attendance-team-requests.component';
import { SchedularComponent } from './components/schedular/schedular.component';
import { SchedularRequestsComponent } from './components/schedular-requests/schedular-requests.component';
import { SchedularTeamComponent } from './components/schedular-team-requests/schedular-team.component';
import { OvertimeManagementComponent } from './components/overtime-management/overtime-management.component';
import { OvertimeTeamRequestsComponent } from './components/overtime-team-requests/overtime-team-requests.component';
import { SchedulerBulkUploadComponent } from './components/scheduler-bulk-upload/scheduler-bulk-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { TeamSchedularComponent } from './components/team-schedular/team-schedular/team-schedular.component';
import { TeamOvertimeComponent } from './components/team-overtime/team-overtime.component';
import { TeamAttendanceComponent } from './components/team-attendance/team-attendance.component';
@NgModule({
  declarations: [
    AttendanceComponent,
    AttendanceRequestsComponent,
    AttendanceTeamRequestsComponent,
    SchedularComponent,
    SchedularRequestsComponent,
    SchedularTeamComponent,
    OvertimeManagementComponent,
    OvertimeTeamRequestsComponent,
    SchedulerBulkUploadComponent,
    TeamSchedularComponent,
    TeamOvertimeComponent,
    TeamAttendanceComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    NgxSpinnerModule,
    NgSelectModule
  ],
  exports: [AttendanceComponent, OvertimeManagementComponent],
  providers: [
    DatePipe
  ]
})
export class AttendanceModule { }
