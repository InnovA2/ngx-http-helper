import { Provider } from '@angular/core';
import { Observable, ObservableInput } from 'rxjs';
import { FeatureKind } from './http-helper.enum';

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
type TokenInterceptor = () => Observable<string | null | undefined>;

interface ITokenSelectors {
    default: TokenInterceptor;
    [key: string]: TokenInterceptor;
}

interface IAuthenticator {
    tokenSelectorKey?: string;
    header?: string;
    scheme?: string;
    domains?: string[];
}

interface IAuthGuard {
    redirectRoute?: string;
}

export interface IAuthFeatureConfig {
    tokenSelectors: ITokenSelectors;
    authenticators: IAuthenticator[];
    guard?: IAuthGuard;
}

export interface IHttpHelperFeature<Feature extends FeatureKind> {
    feature: Feature,
    providers: Provider[],
}

export type HttpHelperFeatures = IHttpHelperFeature<FeatureKind>[];
