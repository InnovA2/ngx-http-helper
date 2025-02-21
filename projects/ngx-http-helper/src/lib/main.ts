import { makeEnvironmentProviders, Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ApiClient } from './api/client/api.client';
import { RestService } from './api/rest/rest.service';
import { FeatureType } from './http-helper.enum';
import type { IHttpHelperFeature, HttpHelperFeatures, IHttpHelperConfig, IAuthInterceptorConfig } from './http-helper';
import { AUTH_INTERCEPTOR_CONFIG_TOKEN, HTTP_HELPER_CONFIG_TOKEN } from './http-helper.tokens';


const getHttpHelperFeature = <Feature extends FeatureType>(feature: Feature, providers: Provider[]): IHttpHelperFeature<FeatureType> => ({
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

export const withAuthInterceptor = (config: IAuthInterceptorConfig): IHttpHelperFeature<FeatureType.AuthInterceptor> =>
    getHttpHelperFeature(FeatureType.AuthInterceptor, [
        {
            provide: AUTH_INTERCEPTOR_CONFIG_TOKEN,
            useValue: config,
        },
        {
            multi: true,
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
        },
    ]);
