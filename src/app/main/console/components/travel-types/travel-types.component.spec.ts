import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelTypesComponent } from './travel-types.component';

describe('TravelTypesComponent', () => {
  let component: TravelTypesComponent;
  let fixture: ComponentFixture<TravelTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TravelTypesComponent]
    });
    fixture = TestBed.createComponent(TravelTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
