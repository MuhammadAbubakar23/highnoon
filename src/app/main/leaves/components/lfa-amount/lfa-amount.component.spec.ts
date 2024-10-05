import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LfaAmountComponent } from './lfa-amount.component';

describe('LfaAmountComponent', () => {
  let component: LfaAmountComponent;
  let fixture: ComponentFixture<LfaAmountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LfaAmountComponent]
    });
    fixture = TestBed.createComponent(LfaAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
