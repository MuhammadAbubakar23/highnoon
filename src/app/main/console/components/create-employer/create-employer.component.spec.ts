import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployerComponent } from './create-employer.component';

describe('CreateEmployerComponent', () => {
  let component: CreateEmployerComponent;
  let fixture: ComponentFixture<CreateEmployerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEmployerComponent]
    });
    fixture = TestBed.createComponent(CreateEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
