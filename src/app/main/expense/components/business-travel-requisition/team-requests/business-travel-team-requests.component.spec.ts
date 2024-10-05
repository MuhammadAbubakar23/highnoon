import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTravelTeamRequestsComponent } from './business-travel-team-requests.component';

describe('BusinessTravelTeamRequestsComponent', () => {
  let component: BusinessTravelTeamRequestsComponent;
  let fixture: ComponentFixture<BusinessTravelTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTravelTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(BusinessTravelTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
