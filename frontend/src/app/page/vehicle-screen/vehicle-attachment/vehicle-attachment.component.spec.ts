import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAttachmentComponent } from './vehicle-attachment.component';

describe('VehicleAttachmentComponent', () => {
  let component: VehicleAttachmentComponent;
  let fixture: ComponentFixture<VehicleAttachmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleAttachmentComponent]
    });
    fixture = TestBed.createComponent(VehicleAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
