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

    get<T>(urlOrPath: UrlBuilder | string, opts: IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>> {
        return this.call<T>('get', urlOrPath, opts);
    }

    post<T>(urlOrPath: UrlBuilder | string, data: any, opts: IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>> {
        return this.call<T>('post', urlOrPath, opts, data);
    }

    put<T>(urlOrPath: UrlBuilder | string, data: any, opts: IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>> {
        return this.call<T>('put', urlOrPath, opts, data);
    }

    patch<T>(urlOrPath: UrlBuilder | string, data: any, opts: IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>> {
        return this.call<T>('patch', urlOrPath, opts, data);
    }

    delete<T>(urlOrPath: UrlBuilder | string, data?: any, opts: IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>> {
        return this.call<T>('delete', urlOrPath, opts, data);
    }

    private getUrl(urlOrPath: UrlBuilder | string, baseUrlKey: keyof typeof this.config.baseUrls) {
        const initialBaseUrl = this.config.baseUrls[baseUrlKey];
        if (!initialBaseUrl) {
            throw Error(`BaseUrl '${baseUrlKey}' does not exist. Please declare it from the provideHttpHelper()`);
        }

        const baseUrl = UrlBuilder.createFromUrl(this.config.baseUrls[baseUrlKey] || '')

        if (typeof urlOrPath === 'string') {
            const url = UrlBuilder.createFromUrl(urlOrPath, window.location.origin);
            return baseUrl.mergePathWith(url);
        }

        return baseUrl.mergePathWith(urlOrPath);
    }

    private call<T>(method: string, urlOrPath: UrlBuilder | string, opts: IApiClientOpts<typeof this.config.baseUrls>, data?: any): Observable<HttpResponse<T>> {
        const options: any = {
            observe: 'response',
            ...opts,
            headers: {
                ['Content-Type']: 'application/json',
                ...(opts['headers'] || {}),
            }
        }

        const url = this.getUrl(urlOrPath, opts.baseUrlKey || 'default');

        const call = this.httpClient.request(method, url.toString(), {
            body: data,
            ...options
        })

        return call.pipe(catchError(this.config.catch || (err => throwError(() => err))));
    }
}
