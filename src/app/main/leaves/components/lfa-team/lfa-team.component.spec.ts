import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LfaTeamComponent } from './lfa-team.component';

describe('LfaTeamComponent', () => {
  let component: LfaTeamComponent;
  let fixture: ComponentFixture<LfaTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LfaTeamComponent]
    });
    fixture = TestBed.createComponent(LfaTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
