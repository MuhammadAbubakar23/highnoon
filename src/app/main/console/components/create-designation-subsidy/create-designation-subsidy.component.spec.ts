import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDesignationSubsidyComponent } from './create-designation-subsidy.component';

describe('CreateDesignationSubsidyComponent', () => {
  let component: CreateDesignationSubsidyComponent;
  let fixture: ComponentFixture<CreateDesignationSubsidyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDesignationSubsidyComponent]
    });
    fixture = TestBed.createComponent(CreateDesignationSubsidyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
