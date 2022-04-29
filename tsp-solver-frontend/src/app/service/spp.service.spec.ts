import { TestBed } from '@angular/core/testing';

import { SppService } from './spp.service';

describe('SppService', () => {
  let service: SppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
