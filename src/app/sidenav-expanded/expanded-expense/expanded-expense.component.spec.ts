import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedExpenseComponent } from './expanded-expense.component';

describe('ExpandedExpenseComponent', () => {
  let component: ExpandedExpenseComponent;
  let fixture: ComponentFixture<ExpandedExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandedExpenseComponent]
    });
    fixture = TestBed.createComponent(ExpandedExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
