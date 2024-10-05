import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyDashboardComponent } from './components/my-dashboard/my-dashboard.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TaskComponent } from './components/task/task.component';

const routes: Routes = [
  { path: '', redirectTo: 'my-dashboard', pathMatch: 'full' },
  { path: 'my-dashboard', component: MyDashboardComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'task', component: TaskComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivedashboradRoutingModule { }
