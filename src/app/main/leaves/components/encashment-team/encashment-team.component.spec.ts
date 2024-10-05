import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncashmentTeamComponent } from './encashment-team.component';

describe('EncashmentTeamComponent', () => {
  let component: EncashmentTeamComponent;
  let fixture: ComponentFixture<EncashmentTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncashmentTeamComponent]
    });
    fixture = TestBed.createComponent(EncashmentTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
