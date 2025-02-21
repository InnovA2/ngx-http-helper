import type { IAuthConfig, IClientConfig } from './http-helper';

export class HttpHelperConfig {
    client: IClientConfig = {};
}

export class AuthInterceptorConfig {
    authenticators: IAuthConfig[] = [];
}
