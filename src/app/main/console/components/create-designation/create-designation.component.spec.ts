import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDesignationComponent } from './create-designation.component';

describe('CreateDesignationComponent', () => {
  let component: CreateDesignationComponent;
  let fixture: ComponentFixture<CreateDesignationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDesignationComponent]
    });
    fixture = TestBed.createComponent(CreateDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
