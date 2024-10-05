import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBenefitTypeComponent } from './create-benefit-type.component';

describe('CreateBenefitTypeComponent', () => {
  let component: CreateBenefitTypeComponent;
  let fixture: ComponentFixture<CreateBenefitTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBenefitTypeComponent]
    });
    fixture = TestBed.createComponent(CreateBenefitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
