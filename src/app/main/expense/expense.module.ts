import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ExpenseRoutingModule } from './expense-routing.module';
import { BusinessTravelRequisitionComponent } from './components/business-travel-requisition/business-travel-requisition.component';
import { OpdComponent } from './components/opd/opd.component';
import { ReimbursementComponent } from './components/reimbursement/reimbursement.component';
import { OpdTeamRequestsComponent } from './components/opd-team-requests/opd-team-requests.component';
import { ReimbursementTeamRequestsComponent } from './components/reimbursement-team-requests/reimbursement-team-requests.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
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


@NgModule({
  declarations: [
    BusinessTravelRequisitionComponent,
    OpdComponent,
    ReimbursementComponent,
    OpdTeamRequestsComponent,
    ReimbursementTeamRequestsComponent,
    CreateBusinessTravelRequisitionComponent,
    BusinessTravelRequisitionDetailsComponent,
    BusinessTravelReimbursementComponent,
    BusinessTravelRequisitionTeamRequestsComponent,
    BusinessTravelTeamRequestsComponent,
    TeamRequestsComponent,
    SummaryComponent,
    TeamRequestsSummaryComponent,
    CreateBusinessTravelReimbursementComponent,
    UpdateBusinessTravelReimbursementComponent
  ],
  imports: [
    CommonModule,
    ExpenseRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule,
  ],
  exports: [
    BusinessTravelRequisitionComponent
  ],
  providers: [
    DatePipe,
  ],
})
export class ExpenseModule { }
