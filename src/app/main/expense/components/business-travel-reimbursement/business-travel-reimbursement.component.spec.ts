import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTravelReimbursementComponent } from './business-travel-reimbursement.component';

describe('BusinessTravelReimbursementComponent', () => {
  let component: BusinessTravelReimbursementComponent;
  let fixture: ComponentFixture<BusinessTravelReimbursementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTravelReimbursementComponent]
    });
    fixture = TestBed.createComponent(BusinessTravelReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
