import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHRArticleComponent } from './create-hr-article.component';

describe('CreateHRArticleComponent', () => {
  let component: CreateHRArticleComponent;
  let fixture: ComponentFixture<CreateHRArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateHRArticleComponent]
    });
    fixture = TestBed.createComponent(CreateHRArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
