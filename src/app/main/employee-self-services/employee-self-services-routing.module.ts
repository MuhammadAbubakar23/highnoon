import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { HrpoliciesComponent } from './components/hrpolicies/hrpolicies.component';
import { OvertimeComponent } from './components/overtime/overtime.component';
import { IncomeTaxComponent } from './components/income-tax/income-tax.component';
import { BusinesstravelComponent } from './components/businesstravel/businesstravel.component';
import { ProvidentFundComponent } from './components/provident-fund/provident-fund.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { AuthGuard } from 'src/app/auth/authService/auth.guard';
import { MyLeaveComponent } from './components/my-leave/my-leave.component';
import { SelfTeamRequestsComponent } from './components/self-team-requests/self-team-requests.component';
import { SelfAttendanceComponent } from './components/self-attendance/self-attendance.component';
import { PaySlipComponent } from './components/pay-slip/pay-slip.component';

import { BenefitsTeamRequestsComponent } from './components/benefits-team-requests/benefits-team-requests.component';
import { ProvidentFundTeamRequestsComponent } from './components/provident-fund-team-requests/provident-fund-team-requests.component';
import { HrArticlesComponent } from './components/hr-articles/hr-articles.component';
import { ArticleDetailsComponent } from './components/hr-articles/article-details/article-details.component';
import { LoanComponent } from './components/loan/loan.component';
import { LoanTeamRequestsComponent } from './components/loan-team-requests/loan-team-requests.component';
import { ProfileRequestComponent } from './components/profile-request/profile-request.component';
import { ProfileTeamRequestsComponent } from './components/profile-team-requests/profile-team-requests.component';
import { ProfileSummaryComponent } from './components/profile-request/components/profile-summary/profile-summary.component';
import { TeamRequestSummaryComponent } from './components/profile-team-requests/components/team-request-summary/team-request-summary.component';


const routes: Routes = [
  { path: '', redirectTo: 'my-information', pathMatch: 'full' },
  { path: 'my-information', component: ProfileComponent },
  { path: 'profile-requests', component: ProfileRequestComponent },
  { path: 'profile-requests/summary/:id', component: ProfileSummaryComponent },
  { path: 'profile-team-requests', component: ProfileTeamRequestsComponent },
  { path: 'profile-team-requests/summary', component: TeamRequestSummaryComponent },
  { path: 'my-leave', component: MyLeaveComponent },
  { path: 'team-requests', component: SelfTeamRequestsComponent },
  { path: 'attendance', component: SelfAttendanceComponent },
  { path: 'businesstravel', component: BusinesstravelComponent },
  { path: 'pay-slip', component: PaySlipComponent },
  { path: 'loans', component: LoanComponent },
  { path: 'loans/team-requests', component: LoanTeamRequestsComponent },
  { path: 'provident-fund', component: ProvidentFundComponent },
  { path: 'provident-fund/team-requests', component: ProvidentFundTeamRequestsComponent },
  { path: 'income-tax', component: IncomeTaxComponent },
  { path: 'overtime-request', component: OvertimeComponent },
  { path: 'hr-articles', component: HrArticlesComponent },
  { path: 'hr-articles/handbookdetail/:id', component: ArticleDetailsComponent },
  { path: 'hr-policies', component: HrpoliciesComponent },
  { path: 'benefits', component: BenefitsComponent },
  { path: 'benefits/team-requests', component: BenefitsTeamRequestsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EmployeeSelfServicesRoutingModule { }
