import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationSubsidyComponent } from './designation-subsidy.component';

describe('DesignationSubsidyComponent', () => {
  let component: DesignationSubsidyComponent;
  let fixture: ComponentFixture<DesignationSubsidyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignationSubsidyComponent]
    });
    fixture = TestBed.createComponent(DesignationSubsidyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
