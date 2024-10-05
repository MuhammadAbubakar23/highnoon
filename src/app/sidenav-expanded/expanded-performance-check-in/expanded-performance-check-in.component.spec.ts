import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedPerformanceCheckInComponent } from './expanded-performance-check-in.component';

describe('ExpandedPerformanceCheckInComponent', () => {
  let component: ExpandedPerformanceCheckInComponent;
  let fixture: ComponentFixture<ExpandedPerformanceCheckInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandedPerformanceCheckInComponent]
    });
    fixture = TestBed.createComponent(ExpandedPerformanceCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
