import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeeRoleComponent } from './manage-employee-role.component';

describe('ManageEmployeeRoleComponent', () => {
  let component: ManageEmployeeRoleComponent;
  let fixture: ComponentFixture<ManageEmployeeRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEmployeeRoleComponent]
    });
    fixture = TestBed.createComponent(ManageEmployeeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
