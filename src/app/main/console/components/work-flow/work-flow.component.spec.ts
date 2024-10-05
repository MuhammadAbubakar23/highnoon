import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowComponent } from './work-flow.component';

describe('WorkFlowComponent', () => {
  let component: WorkFlowComponent;
  let fixture: ComponentFixture<WorkFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkFlowComponent]
    });
    fixture = TestBed.createComponent(WorkFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
