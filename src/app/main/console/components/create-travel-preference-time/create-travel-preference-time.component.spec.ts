import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTravelPreferenceTimeComponent } from './create-travel-preference-time.component';

describe('CreateTravelPreferenceTimeComponent', () => {
  let component: CreateTravelPreferenceTimeComponent;
  let fixture: ComponentFixture<CreateTravelPreferenceTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTravelPreferenceTimeComponent]
    });
    fixture = TestBed.createComponent(CreateTravelPreferenceTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
