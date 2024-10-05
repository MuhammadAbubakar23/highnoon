import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelClassComponent } from './travel-class.component';

describe('TravelClassComponent', () => {
  let component: TravelClassComponent;
  let fixture: ComponentFixture<TravelClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TravelClassComponent]
    });
    fixture = TestBed.createComponent(TravelClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
