import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTypeComponent } from './loan-type.component';

describe('LoanTypeComponent', () => {
  let component: LoanTypeComponent;
  let fixture: ComponentFixture<LoanTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanTypeComponent]
    });
    fixture = TestBed.createComponent(LoanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
