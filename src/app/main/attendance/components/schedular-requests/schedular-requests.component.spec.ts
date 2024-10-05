import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedularRequestsComponent } from './schedular-requests.component';

describe('SchedularRequestsComponent', () => {
  let component: SchedularRequestsComponent;
  let fixture: ComponentFixture<SchedularRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedularRequestsComponent]
    });
    fixture = TestBed.createComponent(SchedularRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
