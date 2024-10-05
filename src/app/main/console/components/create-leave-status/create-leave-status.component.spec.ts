import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeaveStatusComponent } from './create-leave-status.component';

describe('CreateLeaveStatusComponent', () => {
  let component: CreateLeaveStatusComponent;
  let fixture: ComponentFixture<CreateLeaveStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLeaveStatusComponent]
    });
    fixture = TestBed.createComponent(CreateLeaveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
