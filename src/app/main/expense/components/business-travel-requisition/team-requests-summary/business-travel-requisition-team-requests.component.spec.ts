import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTravelRequisitionTeamRequestsComponent } from './business-travel-requisition-team-requests.component';

describe('BusinessTravelRequisitionTeamRequestsComponent', () => {
  let component: BusinessTravelRequisitionTeamRequestsComponent;
  let fixture: ComponentFixture<BusinessTravelRequisitionTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTravelRequisitionTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(BusinessTravelRequisitionTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
