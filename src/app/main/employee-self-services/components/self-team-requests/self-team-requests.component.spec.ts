import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfTeamRequestsComponent } from './self-team-requests.component';

describe('SelfTeamRequestsComponent', () => {
  let component: SelfTeamRequestsComponent;
  let fixture: ComponentFixture<SelfTeamRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelfTeamRequestsComponent]
    });
    fixture = TestBed.createComponent(SelfTeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
