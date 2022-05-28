import { TestBed } from '@angular/core/testing';

import { ActiveWhiteboardService } from './active-whiteboard-service.service';

describe('ActiveWhiteboardServiceService', () => {
  let service: ActiveWhiteboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveWhiteboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
