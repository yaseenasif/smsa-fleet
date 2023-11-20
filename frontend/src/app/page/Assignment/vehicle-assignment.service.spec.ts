import { TestBed } from '@angular/core/testing';

import { VehicleAssignmentService } from './vehicle-assignment.service';

describe('VehicleAssignmentService', () => {
  let service: VehicleAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
