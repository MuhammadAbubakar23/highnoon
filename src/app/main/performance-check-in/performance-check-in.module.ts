import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceCheckInRoutingModule } from './performance-check-in-routing.module';
import { PerformanceEvaluationComponent } from './components/performance-evaluation/performance-evaluation.component';


@NgModule({
  declarations: [
    PerformanceEvaluationComponent
  ],
  imports: [
    CommonModule,
    PerformanceCheckInRoutingModule
  ]
})
export class PerformanceCheckInModule { }
