import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { DeligationComponent } from './components/deligation/deligation.component';

const routes: Routes = [
  {
    path: "", component: MainComponent,
    children: [

      { path: 'employee-self-services', loadChildren: () => import("./employee-self-services/employee-self-services.module").then(m => m.EmployeeSelfServicesModule) },

      {
        path: "dashborad", loadChildren: () => import("./livedashborad/livedashborad.module").then(m => m.LivedashboradModule)
      },

      {
        path: "attendance", loadChildren: () => import("./attendance/attendance.module").then(m => m.AttendanceModule)

      },
      {
        path: "performance-check-in", loadChildren: () => import("./performance-check-in/performance-check-in.module").then(m => m.PerformanceCheckInModule)
      },
      {
        path: 'leaves', loadChildren: () => import("./leaves/leaves.module").then(m => m.LeavesModule)
      },
      {path:'expense',loadChildren:()=> import("./expense/expense.module").then(m => m.ExpenseModule)},
      {
        path: 'console', loadChildren: () => import("./console/console.module").then(m => m.ConsoleModule)
      },
      {path:'deligation',component:DeligationComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
