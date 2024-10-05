import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessTravelRequisitionComponent } from './components/business-travel-requisition/business-travel-requisition.component';
import { AuthGuard } from 'src/app/auth/authService/auth.guard';
import { OpdComponent } from './components/opd/opd.component';
import { ReimbursementComponent } from './components/reimbursement/reimbursement.component';
import { OpdTeamRequestsComponent } from './components/opd-team-requests/opd-team-requests.component';
import { ReimbursementTeamRequestsComponent } from './components/reimbursement-team-requests/reimbursement-team-requests.component';
import { CreateBusinessTravelRequisitionComponent } from './components/business-travel-requisition/create-business-travel-requisition/create-business-travel-requisition.component';
import { BusinessTravelRequisitionDetailsComponent } from './components/business-travel-requisition/summary/business-travel-requisition-details.component';
import { BusinessTravelReimbursementComponent } from './components/business-travel-reimbursement/business-travel-reimbursement.component';
import { BusinessTravelRequisitionTeamRequestsComponent } from './components/business-travel-requisition/team-requests-summary/business-travel-requisition-team-requests.component';
import { BusinessTravelTeamRequestsComponent } from './components/business-travel-requisition/team-requests/business-travel-team-requests.component';
import { TeamRequestsComponent } from './components/business-travel-reimbursement/team-requests/team-requests.component';
import { SummaryComponent } from './components/business-travel-reimbursement/summary/summary.component';
import { TeamRequestsSummaryComponent } from './components/business-travel-reimbursement/team-requests-summary/team-requests-summary.component';
import { CreateBusinessTravelReimbursementComponent } from './components/business-travel-reimbursement/create-business-travel-reimbursement/create-business-travel-reimbursement.component';
import { UpdateBusinessTravelReimbursementComponent } from './components/business-travel-reimbursement/update-business-travel-reimbursement/update-business-travel-reimbursement.component';

const routes: Routes = [
  { path: '', redirectTo: 'businesstravelrequisition', pathMatch: 'full' },
  { path: 'businesstravelrequisition', component: BusinessTravelRequisitionComponent },
  { path: 'createbusinesstravelrequisition', component: CreateBusinessTravelRequisitionComponent},
  { path: 'update-requisition/:id', component: CreateBusinessTravelRequisitionComponent},
  { path: 'businesstravelrequisitiondetails/:id', component: BusinessTravelRequisitionDetailsComponent},
  { path: 'business-travel-requisition/team-requests', component: BusinessTravelTeamRequestsComponent},
  { path: 'business-travel-requisition-team-requests/:id', component: BusinessTravelRequisitionTeamRequestsComponent},
  { path: 'opdmedical', component: OpdComponent },
  { path: 'opdmedical/team-requests', component: OpdTeamRequestsComponent },
  { path: 'reimbursement', component: ReimbursementComponent },
  { path: 'reimbursement/team-requests', component: ReimbursementTeamRequestsComponent },
  { path: 'businesstravelreimbursement', component: BusinessTravelReimbursementComponent},
  { path: 'business-travel-reimbursement-team-requests', component: TeamRequestsComponent},
  { path: 'business-travel-reimbursement-summary/:id', component: SummaryComponent},
  { path: 'business-travel-team-request-reimbursement-summary/:id', component: TeamRequestsSummaryComponent},
  { path: 'create-business-travel-reimbursement/:id', component: CreateBusinessTravelReimbursementComponent},
  { path: 'update-reimbursement/:id', component: UpdateBusinessTravelReimbursementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
