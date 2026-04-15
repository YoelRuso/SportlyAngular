import { TestBed } from '@angular/core/testing';

import { FavoriteSports } from './favorite-sports';

describe('FavoriteSports', () => {
  let service: FavoriteSports;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteSports);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
