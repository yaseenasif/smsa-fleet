import { TestBed } from '@angular/core/testing';

import { IndividualFileListService } from './individual-file-list.service';

describe('IndividualFileListService', () => {
  let service: IndividualFileListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndividualFileListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
