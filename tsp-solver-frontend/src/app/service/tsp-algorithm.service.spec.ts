import {TestBed} from '@angular/core/testing';

import {TspAlgorithmService} from './tsp-algorithm.service';

describe('TspAlgorithmService', () => {
  let service: TspAlgorithmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TspAlgorithmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
