import { Provider } from '@angular/core';
import { Observable, ObservableInput } from 'rxjs';
import { FeatureType } from './http-helper.enum';

// Global config
export interface IBaseUrls {
    default: string;
    [key: string]: string;
}

export interface IHttpHelperConfig {
    baseUrls: IBaseUrls;
    catch?: (err: any, caught: Observable<any>) => ObservableInput<any>;
}

// Features config
interface IAuthConfig {
    tokenSelector: () => Observable<string>;
    header?: string;
    scheme?: string;
    domains?: string[];
}

export interface IAuthInterceptorConfig {
    authenticators: IAuthConfig[];
}

export interface IHttpHelperFeature<Feature extends FeatureType> {
    feature: Feature,
    providers: Provider[],
}

export type HttpHelperFeatures = IHttpHelperFeature<FeatureType>[];
