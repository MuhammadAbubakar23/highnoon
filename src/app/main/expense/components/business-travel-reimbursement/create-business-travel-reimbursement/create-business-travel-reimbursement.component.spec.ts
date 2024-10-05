import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusinessTravelReimbursementComponent } from './create-business-travel-reimbursement.component';

describe('CreateBusinessTravelReimbursementComponent', () => {
  let component: CreateBusinessTravelReimbursementComponent;
  let fixture: ComponentFixture<CreateBusinessTravelReimbursementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBusinessTravelReimbursementComponent]
    });
    fixture = TestBed.createComponent(CreateBusinessTravelReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
