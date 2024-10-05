import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBenefitAvailabilityComponent } from './create-benefit-availability.component';

describe('CreateBenefitAvailabilityComponent', () => {
  let component: CreateBenefitAvailabilityComponent;
  let fixture: ComponentFixture<CreateBenefitAvailabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBenefitAvailabilityComponent]
    });
    fixture = TestBed.createComponent(CreateBenefitAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
