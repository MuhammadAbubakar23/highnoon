import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrArticlesComponent } from './hr-articles.component';

describe('HrArticlesComponent', () => {
  let component: HrArticlesComponent;
  let fixture: ComponentFixture<HrArticlesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrArticlesComponent]
    });
    fixture = TestBed.createComponent(HrArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
