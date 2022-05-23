import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TspAlgorithmService} from './tsp-algorithm.service';

describe('TspAlgorithmService', () => {
  let service: TspAlgorithmService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(TspAlgorithmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
