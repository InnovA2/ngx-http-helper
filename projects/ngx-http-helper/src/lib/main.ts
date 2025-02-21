import { makeEnvironmentProviders, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptorConfig, HttpHelperConfig } from './http-helper.config';
import { ApiClient } from './api/client/api.client';
import { RestService } from './api/rest/rest.service';
import { CacheModule } from 'ionic-cache';
import { FeatureType, HttpHelperFeature, HttpHelperFeatures } from './http-helper';


@NgModule({
    declarations: [],
    exports: [],
    imports: [CacheModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class NgxHttpHelperModule {
    static forRoot(config: HttpHelperConfig): ModuleWithProviders<NgxHttpHelperModule> {
        return {
            ngModule: NgxHttpHelperModule,
            providers: [
                {
                    provide: HttpHelperConfig,
                    useValue: config,
                },
                {
                    multi: true,
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                },
                ApiClient,
                RestService
            ]
        }
    }
}

const getHttpHelperFeature = <Feature extends FeatureType>(feature: Feature, providers: Provider[]): HttpHelperFeature<FeatureType> => ({
    feature,
    providers,
});

export const provideHttpHelper = (config: HttpHelperConfig, ...features: HttpHelperFeatures) =>
    makeEnvironmentProviders([
        {
            provide: HttpHelperConfig,
            useValue: config,
        },
        ApiClient,
        RestService,
        features.map((feature) => feature.providers)
    ]);

export const withAuthInterceptor = (config: AuthInterceptorConfig): HttpHelperFeature<FeatureType.AuthInterceptor> =>
    getHttpHelperFeature(FeatureType.AuthInterceptor, [
        {
            provide: AuthInterceptorConfig,
            useValue: config,
        },
        {
            multi: true,
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
        },
    ]);
