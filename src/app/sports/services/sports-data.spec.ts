import { TestBed } from '@angular/core/testing';

import { SportsData } from './sports-data';

describe('SportsData', () => {
  let service: SportsData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SportsData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
