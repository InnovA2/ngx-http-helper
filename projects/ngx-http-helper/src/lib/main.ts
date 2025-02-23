import { makeEnvironmentProviders, Provider } from '@angular/core';
import { ApiClient } from './api/client/api.client';
import { RestService } from './api/rest/rest.service';
import { FeatureKind } from './http-helper.enum';
import type { IHttpHelperFeature, HttpHelperFeatures, IHttpHelperConfig, IAuthFeatureConfig } from './http-helper';
import { AUTH_FEATURE_CONFIG_TOKEN, HTTP_HELPER_CONFIG_TOKEN } from './http-helper.tokens';


const getHttpHelperFeature = <Feature extends FeatureKind>(feature: Feature, providers: Provider[]): IHttpHelperFeature<FeatureKind> => ({
    feature,
    providers,
});

export const provideHttpHelper = (config: IHttpHelperConfig, ...features: HttpHelperFeatures) =>
    makeEnvironmentProviders([
        {
            provide: HTTP_HELPER_CONFIG_TOKEN,
            useValue: config,
        },
        ApiClient,
        RestService,
        features.map((feature) => feature.providers)
    ]);

export const withAuth = (config: IAuthFeatureConfig): IHttpHelperFeature<FeatureKind.Auth> =>
    getHttpHelperFeature(FeatureKind.Auth, [
        {
            provide: AUTH_FEATURE_CONFIG_TOKEN,
            useValue: config,
        },
    ]);
