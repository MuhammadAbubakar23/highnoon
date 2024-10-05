import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdTeamRequestsComponent } from './opd-team-requests.component';

describe('OpdTeamRequestsComponent', () => {
  let component: OpdTeamRequestsComponent;
  let fixture: ComponentFixture<OpdTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpdTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(OpdTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
