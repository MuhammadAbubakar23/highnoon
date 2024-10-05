import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTravelRequisitionComponent } from './business-travel-requisition.component';

describe('BusinessTravelRequisitionComponent', () => {
  let component: BusinessTravelRequisitionComponent;
  let fixture: ComponentFixture<BusinessTravelRequisitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTravelRequisitionComponent]
    });
    fixture = TestBed.createComponent(BusinessTravelRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
