import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTravelClassesComponent } from './create-travel-classes.component';

describe('CreateTravelClassesComponent', () => {
  let component: CreateTravelClassesComponent;
  let fixture: ComponentFixture<CreateTravelClassesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTravelClassesComponent]
    });
    fixture = TestBed.createComponent(CreateTravelClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
