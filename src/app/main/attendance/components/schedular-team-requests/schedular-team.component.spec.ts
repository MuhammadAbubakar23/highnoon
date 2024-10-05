import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedularTeamComponent } from './schedular-team.component';

describe('SchedularTeamComponent', () => {
  let component: SchedularTeamComponent;
  let fixture: ComponentFixture<SchedularTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedularTeamComponent]
    });
    fixture = TestBed.createComponent(SchedularTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
