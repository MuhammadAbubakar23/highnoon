import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatStageComponent } from './creat-stage.component';

describe('CreatStageComponent', () => {
  let component: CreatStageComponent;
  let fixture: ComponentFixture<CreatStageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatStageComponent]
    });
    fixture = TestBed.createComponent(CreatStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
