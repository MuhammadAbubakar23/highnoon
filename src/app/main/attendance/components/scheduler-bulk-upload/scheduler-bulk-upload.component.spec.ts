import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerBulkUploadComponent } from './scheduler-bulk-upload.component';

describe('SchedulerBulkUploadComponent', () => {
  let component: SchedulerBulkUploadComponent;
  let fixture: ComponentFixture<SchedulerBulkUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulerBulkUploadComponent]
    });
    fixture = TestBed.createComponent(SchedulerBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
