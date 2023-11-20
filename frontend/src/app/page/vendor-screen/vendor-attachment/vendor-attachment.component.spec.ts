import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAttachmentComponent } from './vendor-attachment.component';

describe('VendorAttachmentComponent', () => {
  let component: VendorAttachmentComponent;
  let fixture: ComponentFixture<VendorAttachmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorAttachmentComponent]
    });
    fixture = TestBed.createComponent(VendorAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
