import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableMedicineComponent } from './available-medicine.component';

describe('AvailableMedicineComponent', () => {
  let component: AvailableMedicineComponent;
  let fixture: ComponentFixture<AvailableMedicineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableMedicineComponent]
    });
    fixture = TestBed.createComponent(AvailableMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
