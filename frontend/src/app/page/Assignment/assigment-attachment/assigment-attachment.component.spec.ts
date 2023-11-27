import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigmentAttachmentComponent } from './assigment-attachment.component';

describe('AssigmentAttachmentComponent', () => {
  let component: AssigmentAttachmentComponent;
  let fixture: ComponentFixture<AssigmentAttachmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssigmentAttachmentComponent]
    });
    fixture = TestBed.createComponent(AssigmentAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
