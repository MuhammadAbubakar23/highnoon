import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccrualsTeamComponent } from './accruals-team.component';

describe('AccrualsTeamComponent', () => {
  let component: AccrualsTeamComponent;
  let fixture: ComponentFixture<AccrualsTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccrualsTeamComponent]
    });
    fixture = TestBed.createComponent(AccrualsTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
