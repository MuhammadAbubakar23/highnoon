import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatWorkFlowComponent } from './creat-work-flow.component';

describe('CreatWorkFlowComponent', () => {
  let component: CreatWorkFlowComponent;
  let fixture: ComponentFixture<CreatWorkFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatWorkFlowComponent]
    });
    fixture = TestBed.createComponent(CreatWorkFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
