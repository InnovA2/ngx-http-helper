import { catchError, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UrlBuilder } from '@innova2/url-builder';
import { Router } from '@angular/router';
import { CacheService } from 'ionic-cache';
import { Config } from '../config';

interface CacheOpts {
    group: string;
    ttl: number;
}

@Injectable()
export class ApiClient {
    constructor(private httpClient: HttpClient,
                private config: Config,
                private router: Router,
                private cacheService: CacheService) {
    }

    get<T>(url: UrlBuilder, cache?: CacheOpts, opts?: any): Observable<HttpResponse<T>> {
        const call = this.call<T>('get', url, opts || {});

        return cache && cache.ttl > 0
            ? this.cacheService.loadFromObservable(url.getRelativePath(true), call, cache.group, cache.ttl)
            : call;
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

    protected call<T>(method: string, url: UrlBuilder, opts: any, data?: any): Observable<HttpResponse<T>> {
        const options = {
            observe: 'response',
            ...opts,
            headers: {
                ['Content-Type']: 'application/json',
                ...opts.headers,
            }
        }
        const { client: config } = this.config.client;

        this.httpClient.get('').pipe(catchError(err => err));

        const call = ['post', 'put', 'patch'].includes(method)
            ? this.httpClient[method]<T>(url.toString(), options)
            : this.httpClient[method]<T>(url.toString(), data, { ...options, data });

        return call.pipe(catchError(config.catch || (err => throwError(() => err))));
    }
}
