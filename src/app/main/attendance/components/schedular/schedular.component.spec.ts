import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedularComponent } from './schedular.component';

describe('SchedularComponent', () => {
  let component: SchedularComponent;
  let fixture: ComponentFixture<SchedularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedularComponent]
    });
    fixture = TestBed.createComponent(SchedularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
