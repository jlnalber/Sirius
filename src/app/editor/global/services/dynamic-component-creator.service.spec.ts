import { TestBed } from '@angular/core/testing';

import { DynamicComponentCreatorService } from './dynamic-component-creator.service';

describe('DynamicComponentCreatorService', () => {
  let service: DynamicComponentCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicComponentCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
