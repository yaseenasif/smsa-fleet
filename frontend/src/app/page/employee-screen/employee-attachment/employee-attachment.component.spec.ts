import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttachmentComponent } from './employee-attachment.component';

describe('EmployeeAttachmentComponent', () => {
  let component: EmployeeAttachmentComponent;
  let fixture: ComponentFixture<EmployeeAttachmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeAttachmentComponent]
    });
    fixture = TestBed.createComponent(EmployeeAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
