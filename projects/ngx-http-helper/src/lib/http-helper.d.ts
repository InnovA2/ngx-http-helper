import { Provider } from '@angular/core';
import { Observable, ObservableInput } from 'rxjs';

export interface IClientConfig {
    baseUrl?: string;
    defaultCacheTTL?: number;
    catch?: (err: any, caught: Observable<any>) => ObservableInput<any>;
}

export interface IAuthConfig {
    tokenSelector: () => Observable<string>;
    header?: string;
    scheme?: string;
    domains?: string[];
}

export const enum FeatureType {
    AuthInterceptor,
}

interface HttpHelperFeature<Feature extends FeatureType> {
    feature: Feature,
    providers: Provider[],
}

type HttpHelperFeatures = HttpHelperFeature<FeatureType>[];
