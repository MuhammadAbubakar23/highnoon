import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTravelRequisitionDetailsComponent } from './business-travel-requisition-details.component';

describe('BusinessTravelRequisitionDetailsComponent', () => {
  let component: BusinessTravelRequisitionDetailsComponent;
  let fixture: ComponentFixture<BusinessTravelRequisitionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTravelRequisitionDetailsComponent]
    });
    fixture = TestBed.createComponent(BusinessTravelRequisitionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
