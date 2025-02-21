import { InjectionToken } from '@angular/core';
import type { IAuthInterceptorConfig, IHttpHelperConfig } from './http-helper';

export const HTTP_HELPER_CONFIG_TOKEN = new InjectionToken<IHttpHelperConfig>('HTTP_HELPER_CONFIG');
export const AUTH_INTERCEPTOR_CONFIG_TOKEN = new InjectionToken<IAuthInterceptorConfig>('AUTH_INTERCEPTOR_CONFIG');
