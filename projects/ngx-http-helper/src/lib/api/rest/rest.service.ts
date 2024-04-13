import { map } from 'rxjs/operators';
import { mergeMap, Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ApiClient } from '../client/api.client';
import { UrlBuilder } from '@innova2/url-builder';
import { Config } from '../../config';
import { BaseApiOptions, CacheOptions, FindAllOptions, FindOptions } from '../api-options';
import { PaginatedData } from './paginated-data';
import { Injectable } from '@angular/core';

@Injectable()
export class RestService<O, I = O> {
    protected readonly baseUrl = this.config.client.baseUrl;
    protected readonly resourceUri!: string;

    constructor(protected config: Config,
                protected apiClient: ApiClient) {
    }

    findAll(opts?: FindAllOptions): Observable<O[]>;

    findAll(page: number, opts?: FindAllOptions): Observable<PaginatedData<O>>;

    findAll(pageOrOpts?: number | FindAllOptions, opts?: FindAllOptions): any {
        const options = (typeof pageOrOpts === 'number' ? opts : pageOrOpts) || {};
        const page = typeof pageOrOpts === 'number' ? pageOrOpts : null;

        const url = this.getBaseUrl(options.resourceUri).getPathParams()
            .addAll(options.params || {})
            .getBaseUrl();

        const queryParams = url.getQueryParams();
        if (page) {
            queryParams.add('page', page);
        }
        if (options.q) {
            if (typeof options.q === 'object') {
                for (const [key, value] of Object.entries(options.q)) {
                    queryParams.add(`q[${key}]`, value);
                }
            } else {
                queryParams.add('q', options.q);
            }
        }

        return this.apiClient
            .get<O[]>(url, this.initializeCacheOptions(url, options.ttl))
            .pipe(map((res) => res.body));
    }

    findById(id: string | number, opts: FindOptions = {}): Observable<O> {
        const url = this.buildUrlById(id, opts);

        return this.apiClient
            .get<O>(url, this.initializeCacheOptions(url, opts.ttl))
            .pipe(map((res) => res.body as O));
    }

    create(data: Partial<I>, opts: BaseApiOptions = {}, callIdentifier = false): Observable<O> {
        const url = this.getBaseUrl(opts.resourceUri).getPathParams()
            .addAll(opts.params || {})
            .getBaseUrl();

        if (opts.queryParams) {
            url.getQueryParams().addAll(opts.queryParams);
        }

        return this.apiClient.post<O>(url, data).pipe(
            mergeMap((res) => {
                if (!callIdentifier) {
                    return of(res);
                }
                const path = res.headers.get('location');
                if (!path) {
                    throw Error('Location header not found');
                }
                const identifierUrl = url.copy().setPathSegments([path.replace(/^\/+/g, '')]);
                return this.apiClient.get<O>(identifierUrl, this.initializeCacheOptions(identifierUrl));
            }),
            map((res) => res.body as O)
        );
    }

    update(id: string | number, data: Partial<I>, opts: BaseApiOptions = {}): Observable<O> {
        const url = this.buildUrlById(id, opts);

        return this.apiClient
            .patch<O>(url, data)
            .pipe(map((res) => res.body as O));
    }

    delete(id: string | number, opts: BaseApiOptions = {}, data?: Partial<I>): Observable<HttpResponse<void>> {
        const url = this.buildUrlById(id, opts);
        return this.apiClient.delete<void>(url, data);
    }

    protected initializeCacheOptions = (url: UrlBuilder, ttl?: number): CacheOptions => ({
        group: url.getRelativePath(),
        ttl: ttl ?? this.config.client.defaultCacheTTL ?? 0,
    })

    private buildUrlById(id: string | number, opts: BaseApiOptions = {}) {
        return this.getBaseUrl(opts.resourceUri)
            .addPath(':id', { ...opts.params, id })
            .getQueryParams().addAll(opts.queryParams || {})
            .getBaseUrl();
    }

    private getBaseUrl(resourceUri?: string): UrlBuilder {
        if (!this.baseUrl) {
            throw Error('BaseUrl is not defined');
        }

        return UrlBuilder.createFromUrl(this.baseUrl)
            .addPath(resourceUri ?? this.resourceUri);
    }
}
