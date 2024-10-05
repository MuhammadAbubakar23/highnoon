import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAvailableMedicineComponent } from './create-available-medicine.component';

describe('CreateAvailableMedicineComponent', () => {
  let component: CreateAvailableMedicineComponent;
  let fixture: ComponentFixture<CreateAvailableMedicineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAvailableMedicineComponent]
    });
    fixture = TestBed.createComponent(CreateAvailableMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
