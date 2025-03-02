import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { first, mergeMap } from 'rxjs';
import { UrlBuilder } from '@innova2/url-builder';
import { AUTH_FEATURE_CONFIG_TOKEN } from '../../http-helper.tokens';
import { IAuthenticator, IAuthFeatureConfig } from '../../http-helper.types';

const findAuthConfig = (domain: string, config: IAuthFeatureConfig): IAuthenticator | undefined => {
    return config.authenticators.find(c => {
        if (!c.domains?.length) {
            return true;
        }

        return c.domains
            .map(d => UrlBuilder.createFromUrl(d).getHost())
            .some(host => host === domain);
    });
}

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const config = inject(AUTH_FEATURE_CONFIG_TOKEN);
    if (!config?.authenticators) {
        throw Error(`The auth config does not exist. Please declare it from the withAuth()`);
    }

    const domain = UrlBuilder.createFromUrl(req.url).getHost();
    const authConfig = findAuthConfig(domain, config);

    if (!authConfig) {
        return next(req);
    }

    const tokenSelector = config.tokenSelectors[authConfig.tokenSelectorKey || 'default'];

    if (!tokenSelector) {
        throw Error(`No tokenSelectorKey '${authConfig.tokenSelectorKey}' for domain '${domain}'. Please declare it from the withAuth()`);
    }

    return tokenSelector().pipe(
        first(),
        mergeMap(token => {
            if (token) {
                req = req.clone({
                    setHeaders: {
                        [authConfig.header || 'Authorization']: authConfig.scheme ? `${authConfig.scheme} ${token}` : token,
                    }
                });
            }

            return next(req);
        })
    );
}
