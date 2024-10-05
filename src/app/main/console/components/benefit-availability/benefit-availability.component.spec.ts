import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitAvailabilityComponent } from './benefit-availability.component';

describe('BenefitAvailabilityComponent', () => {
  let component: BenefitAvailabilityComponent;
  let fixture: ComponentFixture<BenefitAvailabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BenefitAvailabilityComponent]
    });
    fixture = TestBed.createComponent(BenefitAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
