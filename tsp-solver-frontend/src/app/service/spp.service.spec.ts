import { TestBed } from '@angular/core/testing';

import { SppService } from './spp.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('SppService', () => {
  let service: SppService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(SppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
