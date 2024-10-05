import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusinessTravelRequisitionComponent } from './create-business-travel-requisition.component';

describe('CreateBusinessTravelRequisitionComponent', () => {
  let component: CreateBusinessTravelRequisitionComponent;
  let fixture: ComponentFixture<CreateBusinessTravelRequisitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBusinessTravelRequisitionComponent]
    });
    fixture = TestBed.createComponent(CreateBusinessTravelRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
