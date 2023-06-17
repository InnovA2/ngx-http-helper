import { TestBed } from '@angular/core/testing';

import { ApiClient } from './api-client';

describe('ApiClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiClient = TestBed.inject(ApiClient);
    expect(service).toBeTruthy();
  });
});
