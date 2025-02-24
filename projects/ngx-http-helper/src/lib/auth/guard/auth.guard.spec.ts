import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard = (redirectRoute?: string, selector?: string): CanActivateFn => (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(redirectRoute, selector)(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard()).toBeTruthy();
  });
});
