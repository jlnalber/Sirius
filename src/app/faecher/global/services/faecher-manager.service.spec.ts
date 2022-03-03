import { TestBed } from '@angular/core/testing';

import { FaecherManagerService } from './faecher-manager.service';

describe('FaecherManagerService', () => {
  let service: FaecherManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaecherManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
