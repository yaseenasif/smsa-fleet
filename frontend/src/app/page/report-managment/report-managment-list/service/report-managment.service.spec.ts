import { TestBed } from '@angular/core/testing';

import { ReportManagmentService } from './report-managment.service';

describe('ReportManagmentService', () => {
  let service: ReportManagmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportManagmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
