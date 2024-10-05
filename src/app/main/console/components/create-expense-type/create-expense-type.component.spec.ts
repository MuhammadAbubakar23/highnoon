import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpenseTypeComponent } from './create-expense-type.component';

describe('CreateExpenseTypeComponent', () => {
  let component: CreateExpenseTypeComponent;
  let fixture: ComponentFixture<CreateExpenseTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateExpenseTypeComponent]
    });
    fixture = TestBed.createComponent(CreateExpenseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
