import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoanTypeComponent } from './create-loan-type.component';

describe('CreateLoanTypeComponent', () => {
  let component: CreateLoanTypeComponent;
  let fixture: ComponentFixture<CreateLoanTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLoanTypeComponent]
    });
    fixture = TestBed.createComponent(CreateLoanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
