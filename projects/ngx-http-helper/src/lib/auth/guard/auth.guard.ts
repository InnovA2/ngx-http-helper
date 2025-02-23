import { catchError, first, map, of } from 'rxjs';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_FEATURE_CONFIG_TOKEN } from '../../http-helper.tokens';

export const authGuard = (redirectRoute?: string, selector: string = 'default'): CanActivateFn => () => {
  const router = inject(Router);
  const config = inject(AUTH_FEATURE_CONFIG_TOKEN);

  if (!config) {
    throw Error(`The auth config does not exist. Please declare it from the withAuth()`);
  }

  const tokenSelector = config.tokenSelectors[selector || 'default'];

  if (!tokenSelector) {
    throw Error(`No tokenSelector for key '${selector}'. Please declare it from the withAuth()`);
  }

  const redirectUrl = router.createUrlTree([redirectRoute || config.guard?.redirectRoute || '']);

  return tokenSelector().pipe(
    first(),
    map(token => !!token || redirectUrl),
    catchError(() => of(redirectUrl)),
  );
};
