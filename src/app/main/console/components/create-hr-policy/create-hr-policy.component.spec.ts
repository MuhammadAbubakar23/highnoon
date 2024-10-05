import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHRPolicyComponent } from './create-hr-policy.component';

describe('CreateHRPolicyComponent', () => {
  let component: CreateHRPolicyComponent;
  let fixture: ComponentFixture<CreateHRPolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateHRPolicyComponent]
    });
    fixture = TestBed.createComponent(CreateHRPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
