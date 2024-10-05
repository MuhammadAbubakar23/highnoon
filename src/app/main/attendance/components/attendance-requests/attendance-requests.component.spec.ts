import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRequestsComponent } from './attendance-requests.component';

describe('AttendanceRequestsComponent', () => {
  let component: AttendanceRequestsComponent;
  let fixture: ComponentFixture<AttendanceRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceRequestsComponent]
    });
    fixture = TestBed.createComponent(AttendanceRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
