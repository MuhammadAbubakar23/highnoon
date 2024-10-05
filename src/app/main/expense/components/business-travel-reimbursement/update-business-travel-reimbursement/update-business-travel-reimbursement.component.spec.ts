import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBusinessTravelReimbursementComponent } from './update-business-travel-reimbursement.component';

describe('UpdateBusinessTravelReimbursementComponent', () => {
  let component: UpdateBusinessTravelReimbursementComponent;
  let fixture: ComponentFixture<UpdateBusinessTravelReimbursementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBusinessTravelReimbursementComponent]
    });
    fixture = TestBed.createComponent(UpdateBusinessTravelReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
