import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { SchedularComponent } from './components/schedular/schedular.component';
import { OvertimeManagementComponent } from './components/overtime-management/overtime-management.component';
import { AttendanceRequestsComponent } from './components/attendance-requests/attendance-requests.component';
import { AttendanceTeamRequestsComponent } from './components/attendance-team-requests/attendance-team-requests.component';
import { SchedularRequestsComponent } from './components/schedular-requests/schedular-requests.component';
import { SchedularTeamComponent } from './components/schedular-team-requests/schedular-team.component';
import { OvertimeTeamRequestsComponent } from './components/overtime-team-requests/overtime-team-requests.component';
import { SchedulerBulkUploadComponent } from './components/scheduler-bulk-upload/scheduler-bulk-upload.component';
import { TeamSchedularComponent } from './components/team-schedular/team-schedular/team-schedular.component';
import { TeamOvertimeComponent } from './components/team-overtime/team-overtime.component';
import { TeamAttendanceComponent } from './components/team-attendance/team-attendance.component';

const routes: Routes = [
  { path: '', component: AttendanceComponent },
  { path: 'my-requests', component: AttendanceRequestsComponent },
  { path: 'team-requests', component: AttendanceTeamRequestsComponent },
  {path:'team-attendance',component:TeamAttendanceComponent},
  { path: 'roster', component: SchedularComponent },
  { path: 'team-roster', component: TeamSchedularComponent },
  { path: 'roster/my-requests', component: SchedularRequestsComponent },
  { path: 'roster/team-requests', component: SchedularTeamComponent },
  { path: 'roster/team/bulk-upload', component: SchedulerBulkUploadComponent },
  { path: 'overtime', component: OvertimeManagementComponent },
  { path: 'overtime/team-requests', component: OvertimeTeamRequestsComponent },
  { path: 'team-overtime', component: TeamOvertimeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
