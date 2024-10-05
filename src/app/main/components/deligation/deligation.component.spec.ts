import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeligationComponent } from './deligation.component';

describe('DeligationComponent', () => {
  let component: DeligationComponent;
  let fixture: ComponentFixture<DeligationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeligationComponent]
    });
    fixture = TestBed.createComponent(DeligationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
