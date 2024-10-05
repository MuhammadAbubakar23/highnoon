import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPreferenceTimeComponent } from './travel-preference-time.component';

describe('TravelPreferenceTimeComponent', () => {
  let component: TravelPreferenceTimeComponent;
  let fixture: ComponentFixture<TravelPreferenceTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TravelPreferenceTimeComponent]
    });
    fixture = TestBed.createComponent(TravelPreferenceTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
