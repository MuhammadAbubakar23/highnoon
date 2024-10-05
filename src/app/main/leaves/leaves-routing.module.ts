import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeavesComponent } from './components/leaves/leaves.component';
import { LeavesTeamRequestsComponent } from './components/leaves-team-requests/leaves-team-requests.component';
import { EncashmentComponent } from './components/encashment/encashment.component';
import { AccrualsComponent } from './components/accruals/accruals.component';
import { LfaAmountComponent } from './components/lfa-amount/lfa-amount.component';
import { AuthGuard } from 'src/app/auth/authService/auth.guard';
import { EncashmentTeamComponent } from './components/encashment-team/encashment-team.component';
import { AccrualsTeamComponent } from './components/accruals-team/accruals-team.component';
import { LfaTeamComponent } from './components/lfa-team/lfa-team.component';

const routes: Routes = [
  { path: '', component: LeavesComponent },
  { path: 'team-requests', component: LeavesTeamRequestsComponent },
  { path: 'encashment', component: EncashmentComponent },
  { path: 'accruals', component: AccrualsComponent },
  { path: 'lfa-amount', component: LfaAmountComponent },
  { path: 'encashment/team-requests', component: EncashmentTeamComponent },
  { path: 'accruals/team-requests', component: AccrualsTeamComponent },
  { path: 'lfa-amount/team-requests', component: LfaTeamComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
