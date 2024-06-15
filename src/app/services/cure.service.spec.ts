import { TestBed } from '@angular/core/testing';

import { CureService } from './cure.service';

describe('CureService', () => {
  let service: CureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
