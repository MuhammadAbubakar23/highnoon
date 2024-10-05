import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyTypesComponent } from './currency-types.component';

describe('CurrencyTypesComponent', () => {
  let component: CurrencyTypesComponent;
  let fixture: ComponentFixture<CurrencyTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyTypesComponent]
    });
    fixture = TestBed.createComponent(CurrencyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
