import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageArticlesComponent } from './manage-articles.component';

describe('ManageArticlesComponent', () => {
  let component: ManageArticlesComponent;
  let fixture: ComponentFixture<ManageArticlesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageArticlesComponent]
    });
    fixture = TestBed.createComponent(ManageArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
