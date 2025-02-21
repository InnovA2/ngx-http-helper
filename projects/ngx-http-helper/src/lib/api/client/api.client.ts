import { catchError, Observable, throwError } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UrlBuilder } from '@innova2/url-builder';
import { HttpHelperConfig } from '../../http-helper.config';

@Injectable()
export class ApiClient {
    private httpClient = inject(HttpClient);
    private config = inject(HttpHelperConfig);

    get<T>(url: UrlBuilder, opts?: any): Observable<HttpResponse<T>> {
        return this.call<T>('get', url, opts || {});
    }

    post<T>(url: UrlBuilder, data: any, opts?: any): Observable<HttpResponse<T>> {
        return this.call<T>('post', url, opts || {}, data);
    }

    put<T>(url: UrlBuilder, data: any, opts?: any): Observable<HttpResponse<T>> {
        return this.call<T>('put', url, opts || {}, data);
    }

    patch<T>(url: UrlBuilder, data: any, opts?: any): Observable<HttpResponse<T>> {
        return this.call<T>('patch', url, opts || {}, data);
    }

    delete<T>(url: UrlBuilder, data?: any, opts?: any): Observable<HttpResponse<T>> {
        return this.call<T>('delete', url, opts || {}, data);
    }

    private call<T>(method: string, url: UrlBuilder, opts: any, data?: any): Observable<HttpResponse<T>> {
        const options = {
            observe: 'response',
            ...opts,
            headers: {
                ['Content-Type']: 'application/json',
                ...opts.headers,
            }
        }

        const call = this.httpClient.request(method, url.toString(), {
            body: data,
            ...options
        })

        return call.pipe(catchError(this.config.client.catch || (err => throwError(() => err))));
    }
}
