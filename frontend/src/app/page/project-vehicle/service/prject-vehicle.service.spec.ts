import { TestBed } from '@angular/core/testing';

import { PrjectVehicleService } from './prject-vehicle.service';

describe('PrjectVehicleService', () => {
  let service: PrjectVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrjectVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
