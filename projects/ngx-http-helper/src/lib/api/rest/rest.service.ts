import { map } from 'rxjs/operators';
import { mergeMap, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ApiClient } from '../client/api.client';
import { UrlBuilder } from '@innova2/url-builder';
import { Config } from '../../config';
import { CacheOptions, FindAllOptions, FindOptions, Params } from '../api-options';
import { PaginatedData } from './paginated-data';

@Injectable({
    providedIn: 'root'
})
export class RestService<O, I = any> {
    protected readonly baseUrl!: UrlBuilder;
    protected readonly resourceUri!: string;

    constructor(private config: Config,
                protected apiClient: ApiClient) {
        if (!this.baseUrl && config.client.baseUrl) {
            this.baseUrl = UrlBuilder.createFromUrl(config.client.baseUrl);
        }
    }

    findAll(opts?: FindAllOptions): Observable<O[]>;

    findAll(page: number, opts?: FindAllOptions): Observable<PaginatedData<O>>;

    findAll(pageOrOpts?: number | FindAllOptions, opts?: FindAllOptions): any {
        const options = (typeof pageOrOpts === 'number' ? opts : pageOrOpts) || {};
        const page = typeof pageOrOpts === 'number' ? pageOrOpts : null;

        const url = this.baseUrl.copy().addPath(this.resourceUri, options.params);
        if (page) {
            url.addQueryParam('page', page);
        }
        if (options.q) {
            if (typeof options.q === 'object') {
                for (const [key, value] of Object.entries(options.q)) {
                    url.addQueryParam(`q[${key}]`, value);
                }
            } else {
                url.addQueryParam('q', options.q);
            }
        }

        return this.apiClient
            .get<O[]>(url, this.initializeCacheOptions(url, options.ttl))
            .pipe(map((res) => res.body));
    }

    findById(id: string | number, opts: FindOptions = {}): Observable<O> {
        const url = this.baseUrl.copy()
            .addPath(this.resourceUri, opts.params)
            .addPath(':id', { id })
            .addQueryParams(opts.queryParams || {});

        return this.apiClient
            .get<O>(url, this.initializeCacheOptions(url, opts.ttl))
            .pipe(map((res) => res.body as O));
    }

    create(data: Partial<I>, params?: Params, queryParams?: Params, callIdentifier = false): Observable<O> {
        const url = this.baseUrl.copy().addPath(this.resourceUri, params);
        if (queryParams) {
            url.addQueryParams(queryParams);
        }

        return this.apiClient.post<O>(url, data).pipe(
            mergeMap((res) => {
                if (!callIdentifier) {
                    return of(res);
                }
                const path = res.headers.get('location') || '';
                const identifierUrl = url.copy().setPathSegments([path.replace(/^\/+/g, '')]);
                return this.apiClient.get<O>(identifierUrl, this.initializeCacheOptions(identifierUrl));
            }),
            map((res) => res.body as O)
        );
    }

    update(id: string, data: Partial<I>, params?: Params): Observable<O> {
        const url = this.baseUrl.copy()
            .addPath(this.resourceUri, params)
            .addPath(':id', { id })

        return this.apiClient
            .patch<O>(url, data)
            .pipe(map((res) => res.body as O));
    }

    delete(id: string, params?: Record<string, string | number>, data?: Partial<I>): Observable<HttpResponse<void>> {
        return this.apiClient.delete<void>(
            this.baseUrl.copy()
                .addPath(this.resourceUri, params)
                .addPath(':id', { id }),
            data,
        );
    }

    private initializeCacheOptions = (url: UrlBuilder, ttl?: number): CacheOptions => ({
        group: url.getRelativePath(),
        ttl: ttl ?? this.config.client.defaultCacheTTL ?? 0,
    })
}
