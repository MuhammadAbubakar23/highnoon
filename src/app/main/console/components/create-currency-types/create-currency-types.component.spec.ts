import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCurrencyTypesComponent } from './create-currency-types.component';

describe('CreateCurrencyTypesComponent', () => {
  let component: CreateCurrencyTypesComponent;
  let fixture: ComponentFixture<CreateCurrencyTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCurrencyTypesComponent]
    });
    fixture = TestBed.createComponent(CreateCurrencyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
