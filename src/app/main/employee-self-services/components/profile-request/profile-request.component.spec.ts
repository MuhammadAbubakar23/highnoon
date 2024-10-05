import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRequestComponent } from './profile-request.component';

describe('ProfileRequestComponent', () => {
  let component: ProfileRequestComponent;
  let fixture: ComponentFixture<ProfileRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileRequestComponent]
    });
    fixture = TestBed.createComponent(ProfileRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
