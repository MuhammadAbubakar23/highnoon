import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LeavesRoutingModule } from './leaves-routing.module';
import { LeavesComponent } from './components/leaves/leaves.component';
import { LeavesTeamRequestsComponent } from './components/leaves-team-requests/leaves-team-requests.component';
import { EncashmentComponent } from './components/encashment/encashment.component';
import { AccrualsComponent } from './components/accruals/accruals.component';
import { LfaAmountComponent } from './components/lfa-amount/lfa-amount.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EncashmentTeamComponent } from './components/encashment-team/encashment-team.component';
import { AccrualsTeamComponent } from './components/accruals-team/accruals-team.component';
import { LfaTeamComponent } from './components/lfa-team/lfa-team.component';


@NgModule({
  declarations: [
    LeavesComponent,
    LeavesTeamRequestsComponent,
    EncashmentComponent,
    AccrualsComponent,
    LfaAmountComponent,
    EncashmentTeamComponent,
    AccrualsTeamComponent,
    LfaTeamComponent
  ],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule,
    
  ],
  exports:[
    LeavesComponent,
    LeavesTeamRequestsComponent
  ],
  providers: [
    DatePipe,
  ],

})
export class LeavesModule { }
