import { map } from 'rxjs/operators';
import { mergeMap, Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UrlBuilder } from '@innova2/url-builder';
import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../client/api.client';
import { IBaseApiOptions, IFindAllOptions, IFindOptions, IPaginatedData } from '../api';
import { HTTP_HELPER_CONFIG_TOKEN } from '../../http-helper.tokens';

@Injectable()
export class RestService<O, I = O, P = IPaginatedData<O>> {
    protected config = inject(HTTP_HELPER_CONFIG_TOKEN);
    protected apiClient = inject(ApiClient);

    protected readonly baseUrlKey: string = 'default';
    protected readonly resourceUri!: string;

    findAll(opts?: IFindAllOptions): Observable<O[]>;

    findAll(page: number, opts?: IFindAllOptions): Observable<P>;

    findAll(pageOrOpts?: number | IFindAllOptions, opts?: IFindAllOptions): any {
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
            .get<O[]>(url, { baseUrlKey: this.baseUrlKey });
    }

    findById(id: string | number, opts: IFindOptions = {}): Observable<O> {
        const url = this.buildUrlById(id, opts);

        return this.apiClient
            .get<O>(url, { baseUrlKey: this.baseUrlKey });
    }

    create(data: Partial<I>, opts: IBaseApiOptions = {}, callIdentifier = false): Observable<O> {
        const url = this.getBaseUrl(opts.resourceUri).getPathParams()
            .addAll(opts.params || {})
            .getBaseUrl();

        if (opts.queryParams) {
            url.getQueryParams().addAll(opts.queryParams);
        }

        return this.apiClient.post<HttpResponse<O>>(url, data, {
            baseUrlKey: this.baseUrlKey,
            observe: 'response',
        }).pipe(
            mergeMap((res) => {
                if (!callIdentifier) {
                    return of(res.body as O);
                }
                const path = res.headers.get('location');
                if (!path) {
                    throw Error('Location header not found');
                }
                const identifierUrl = url.copy().setPathSegments([path.replace(/^\/+/g, '')]);
                return this.apiClient.get<O>(identifierUrl, { baseUrlKey: this.baseUrlKey });
            }),
        );
    }

    update(id: string | number, data: Partial<I>, opts: IBaseApiOptions = {}): Observable<O> {
        const url = this.buildUrlById(id, opts);

        return this.apiClient
            .patch<O>(url, data, { baseUrlKey: this.baseUrlKey });
    }

    delete(id: string | number, opts: IBaseApiOptions = {}, data?: Partial<I>): Observable<void> {
        const url = this.buildUrlById(id, opts);
        return this.apiClient.delete<void>(url, data, { baseUrlKey: this.baseUrlKey });
    }

    private buildUrlById(id: string | number, opts: IBaseApiOptions = {}) {
        return this.getBaseUrl(opts.resourceUri)
            .addPath(':id', { ...opts.params, id })
            .getQueryParams().addAll(opts.queryParams || {})
            .getBaseUrl();
    }

    private getBaseUrl(resourceUri?: string): UrlBuilder {
        return new UrlBuilder().addPath(resourceUri ?? this.resourceUri);
    }
}
