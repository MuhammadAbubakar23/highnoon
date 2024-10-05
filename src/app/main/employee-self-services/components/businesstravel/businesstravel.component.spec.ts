import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinesstravelComponent } from './businesstravel.component';

describe('BusinesstravelComponent', () => {
  let component: BusinesstravelComponent;
  let fixture: ComponentFixture<BusinesstravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinesstravelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinesstravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
