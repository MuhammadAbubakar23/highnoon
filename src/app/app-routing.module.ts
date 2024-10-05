import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/authService/auth.guard';

const routes: Routes = [

  {
    path: "auth", loadChildren: () => import("../app/auth/auth.module").then(m => m.AuthModule),
  },

  {
    path: "",
    redirectTo: "connect/console",
    pathMatch: "full",
    canActivate: [AuthGuard]
  },

  {
    path: "connect", loadChildren: () => import("./main/main.module").then(m => m.MainModule),
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
