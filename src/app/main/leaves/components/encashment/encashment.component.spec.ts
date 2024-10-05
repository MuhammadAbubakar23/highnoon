import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncashmentComponent } from './encashment.component';

describe('EncashmentComponent', () => {
  let component: EncashmentComponent;
  let fixture: ComponentFixture<EncashmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncashmentComponent]
    });
    fixture = TestBed.createComponent(EncashmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
