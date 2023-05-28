import { TestBed } from '@angular/core/testing';

import { MappenManagerService } from './mappen-manager.service';

describe('FaecherManagerService', () => {
  let service: MappenManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MappenManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
