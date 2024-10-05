import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTravelTypesComponent } from './create-travel-types.component';

describe('CreateTravelTypesComponent', () => {
  let component: CreateTravelTypesComponent;
  let fixture: ComponentFixture<CreateTravelTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTravelTypesComponent]
    });
    fixture = TestBed.createComponent(CreateTravelTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
