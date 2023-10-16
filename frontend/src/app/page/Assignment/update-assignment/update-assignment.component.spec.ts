import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAssignmentComponent } from './update-assignment.component';

describe('UpdateAssignmentComponent', () => {
  let component: UpdateAssignmentComponent;
  let fixture: ComponentFixture<UpdateAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAssignmentComponent]
    });
    fixture = TestBed.createComponent(UpdateAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
