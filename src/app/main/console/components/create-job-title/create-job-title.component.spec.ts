import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobTitleComponent } from './create-job-title.component';

describe('CreateJobTitleComponent', () => {
  let component: CreateJobTitleComponent;
  let fixture: ComponentFixture<CreateJobTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateJobTitleComponent]
    });
    fixture = TestBed.createComponent(CreateJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
