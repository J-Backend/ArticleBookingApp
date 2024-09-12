import { TestBed } from '@angular/core/testing';

import { LayawayService } from './layaway.service';

describe('LayawayService', () => {
  let service: LayawayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayawayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
