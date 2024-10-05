import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSchedularComponent } from './team-schedular.component';

describe('TeamSchedularComponent', () => {
  let component: TeamSchedularComponent;
  let fixture: ComponentFixture<TeamSchedularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamSchedularComponent]
    });
    fixture = TestBed.createComponent(TeamSchedularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
