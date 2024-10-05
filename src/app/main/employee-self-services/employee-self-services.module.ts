import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeSelfServicesRoutingModule } from './employee-self-services-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { HrpoliciesComponent } from './components/hrpolicies/hrpolicies.component';
import { OvertimeComponent } from './components/overtime/overtime.component';
import { IncomeTaxComponent } from './components/income-tax/income-tax.component';
import { BusinesstravelComponent } from './components/businesstravel/businesstravel.component';

import { ProvidentFundComponent } from './components/provident-fund/provident-fund.component';

import { BenefitsComponent } from './components/benefits/benefits.component';
import { SelectionFiltePipe } from './selection-filte.pipe';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyLeaveComponent } from './components/my-leave/my-leave.component';
import { SelfTeamRequestsComponent } from './components/self-team-requests/self-team-requests.component';
import { SelfAttendanceComponent } from './components/self-attendance/self-attendance.component';
import { PaySlipComponent } from './components/pay-slip/pay-slip.component';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeavesModule } from '../leaves/leaves.module';
import { NgxSpinnerModule } from 'ngx-spinner';

import { BenefitsTeamRequestsComponent } from './components/benefits-team-requests/benefits-team-requests.component';
import { ProvidentFundTeamRequestsComponent } from './components/provident-fund-team-requests/provident-fund-team-requests.component';
import { HrArticlesComponent } from './components/hr-articles/hr-articles.component';
import { ArticleDetailsComponent } from './components/hr-articles/article-details/article-details.component';
import { ExpenseModule } from '../expense/expense.module';
import { LoanComponent } from './components/loan/loan.component';
import { LoanTeamRequestsComponent } from './components/loan-team-requests/loan-team-requests.component';

import { NgOtpInputModule } from  'ng-otp-input';
import { ProfileRequestComponent } from './components/profile-request/profile-request.component';
import { ProfileTeamRequestsComponent } from './components/profile-team-requests/profile-team-requests.component';
import { ProfileSummaryComponent } from './components/profile-request/components/profile-summary/profile-summary.component';
import { TeamRequestSummaryComponent } from './components/profile-team-requests/components/team-request-summary/team-request-summary.component';

@NgModule({
  declarations: [
    ProfileComponent,
    HrArticlesComponent,
    HrpoliciesComponent,
    OvertimeComponent,
    IncomeTaxComponent,
    BusinesstravelComponent,
    ProvidentFundComponent,
    BenefitsComponent,
    SelectionFiltePipe,
    MyLeaveComponent,
    SelfTeamRequestsComponent,
    SelfAttendanceComponent,
    PaySlipComponent,
    BenefitsTeamRequestsComponent,
    ProvidentFundTeamRequestsComponent,
    ArticleDetailsComponent,
    LoanComponent,
    LoanTeamRequestsComponent,
    ProfileRequestComponent,
    ProfileTeamRequestsComponent,
    ProfileSummaryComponent,
    TeamRequestSummaryComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    EmployeeSelfServicesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    AttendanceModule,
    LeavesModule,
    NgxSpinnerModule,
    ExpenseModule,
    NgOtpInputModule
  ],
  exports: [
    HrArticlesComponent,
    HrpoliciesComponent
  ]
})
export class EmployeeSelfServicesModule { }
