import { catchError, Observable, throwError } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UrlBuilder } from '@innova2/url-builder';
import { HTTP_HELPER_CONFIG_TOKEN } from '../../http-helper.tokens';
import { IApiClientOpts } from '../api';

@Injectable()
export class ApiClient {
    private httpClient = inject(HttpClient);
    private config = inject(HTTP_HELPER_CONFIG_TOKEN);

    get<T>(path: UrlBuilder | string, opts: IApiClientOpts = {}): Observable<T> {
        return this.call<T>('get', path, opts);
    }

    post<T>(path: UrlBuilder | string, data: any, opts: IApiClientOpts = {}): Observable<T> {
        return this.call<T>('post', path, opts, data);
    }

    put<T>(path: UrlBuilder | string, data: any, opts: IApiClientOpts = {}): Observable<T> {
        return this.call<T>('put', path, opts, data);
    }

    patch<T>(path: UrlBuilder | string, data: any, opts: IApiClientOpts = {}): Observable<T> {
        return this.call<T>('patch', path, opts, data);
    }

    delete<T>(path: UrlBuilder | string, data?: any, opts: IApiClientOpts = {}): Observable<T> {
        return this.call<T>('delete', path, opts, data);
    }

    private getUrl(path: UrlBuilder | string, baseUrlKey: string) {
        const initialBaseUrl = this.config.baseUrls[baseUrlKey];
        if (!initialBaseUrl) {
            throw Error(`BaseUrl '${baseUrlKey}' does not exist. Please declare it from the provideHttpHelper()`);
        }

        const { origin } = window.location;

        const baseUrl = UrlBuilder.createFromUrl(initialBaseUrl, origin)

        if (typeof path === 'string') {
            const url = UrlBuilder.createFromUrl(path, origin);
            return baseUrl.mergePathWith(url);
        }

        return baseUrl.mergePathWith(path);
    }

    private call<T>(method: string, path: UrlBuilder | string, opts: IApiClientOpts, data?: any): Observable<T> {
        const options: any = {
            ...opts,
            headers: {
                ['Content-Type']: 'application/json',
                ...(opts['headers'] || {}),
            }
        }

        const url = this.getUrl(path, opts.baseUrlKey || 'default');

        const call = this.httpClient.request(method, url.toString(), {
            body: data,
            ...options
        })

        return call.pipe(catchError(this.config.catch || (err => throwError(() => err))));
    }
}
