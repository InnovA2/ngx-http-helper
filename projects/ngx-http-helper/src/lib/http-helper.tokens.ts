import { InjectionToken } from '@angular/core';
import type { IAuthFeatureConfig, IHttpHelperConfig } from './http-helper';

export const HTTP_HELPER_CONFIG_TOKEN = new InjectionToken<IHttpHelperConfig>('HTTP_HELPER_CONFIG');
export const AUTH_FEATURE_CONFIG_TOKEN = new InjectionToken<IAuthFeatureConfig>('AUTH_FEATURE_CONFIG');
