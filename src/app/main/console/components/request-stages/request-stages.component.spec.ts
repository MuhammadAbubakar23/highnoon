import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStagesComponent } from './request-stages.component';

describe('RequestStagesComponent', () => {
  let component: RequestStagesComponent;
  let fixture: ComponentFixture<RequestStagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestStagesComponent]
    });
    fixture = TestBed.createComponent(RequestStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
