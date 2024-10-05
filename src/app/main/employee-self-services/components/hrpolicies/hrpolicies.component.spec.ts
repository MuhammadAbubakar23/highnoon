import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrpoliciesComponent } from './hrpolicies.component';

describe('HrpoliciesComponent', () => {
  let component: HrpoliciesComponent;
  let fixture: ComponentFixture<HrpoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrpoliciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrpoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
