import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTeamRequestsComponent } from './profile-team-requests.component';

describe('ProfileTeamRequestsComponent', () => {
  let component: ProfileTeamRequestsComponent;
  let fixture: ComponentFixture<ProfileTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(ProfileTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
