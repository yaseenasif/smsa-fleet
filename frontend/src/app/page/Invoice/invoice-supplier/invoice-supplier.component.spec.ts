import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSupplierComponent } from './invoice-supplier.component';

describe('InvoiceSupplierComponent', () => {
  let component: InvoiceSupplierComponent;
  let fixture: ComponentFixture<InvoiceSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceSupplierComponent]
    });
    fixture = TestBed.createComponent(InvoiceSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
