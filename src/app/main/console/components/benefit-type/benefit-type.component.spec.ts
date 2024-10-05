import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitTypeComponent } from './benefit-type.component';

describe('BenefitTypeComponent', () => {
  let component: BenefitTypeComponent;
  let fixture: ComponentFixture<BenefitTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BenefitTypeComponent]
    });
    fixture = TestBed.createComponent(BenefitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
