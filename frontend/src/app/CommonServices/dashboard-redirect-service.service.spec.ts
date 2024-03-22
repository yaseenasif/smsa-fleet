import { TestBed } from '@angular/core/testing';

import { DashboardRedirectServiceService } from './dashboard-redirect-service.service';

describe('DashboardRedirectServiceService', () => {
  let service: DashboardRedirectServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardRedirectServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
