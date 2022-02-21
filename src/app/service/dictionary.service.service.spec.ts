import { TestBed } from '@angular/core/testing';

import { Dictionary.ServiceService } from './dictionary.service.service';

describe('Dictionary.ServiceService', () => {
  let service: Dictionary.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dictionary.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
