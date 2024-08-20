import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSupplierComponent } from './invoice-supplier.component';

describe('InvoiceSupplierComponent', () => {
  let component: InvoiceSupplierComponent;
  let fixture: ComponentFixture<InvoiceSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceSupplierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
