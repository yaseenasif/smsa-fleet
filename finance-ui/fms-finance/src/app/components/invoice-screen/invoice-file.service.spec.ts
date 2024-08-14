import { TestBed } from '@angular/core/testing';

import { InvoiceFileService } from './invoice-file.service';

describe('InvoiceFileService', () => {
  let service: InvoiceFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
