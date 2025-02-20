import { TestBed } from '@angular/core/testing';
import { ApiClient } from './api.client';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Config } from '../../config';
import { of, throwError } from 'rxjs';
import { CacheModule, CacheService } from 'ionic-cache';
import { RouterTestingModule } from '@angular/router/testing';
import { UrlBuilder } from '@innova2/url-builder';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ApiClientService', () => {
    const url = 'http://localhost';

    let apiClient: ApiClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        const cacheService = jasmine.createSpyObj('CacheService', {
            loadFromObservable: of({ foo: 'bar' })
        });

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, CacheModule.forRoot()],
            providers: [
                {
                    provide: Config,
                    useValue: {
                        client: {
                            catch: (err: any) => throwError(() => err),
                        }
                    },
                },
                ApiClient,
                { provide: CacheService, useValue: cacheService },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        });

        apiClient = TestBed.inject(ApiClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should call in GET method', () => {
        apiClient.get(UrlBuilder.createFromUrl(url)).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        expect(req.request.method).toBe('GET');
        expect(req.request.url).toBe(url);
    });

    it('should call in GET method with cache', (done) => {
        apiClient.get(UrlBuilder.createFromUrl(url), { ttl: 1, group: 'test' }).subscribe((res) => {
            expect(res).toEqual({ foo: 'bar' } as any);
            done();
        });
    });

    it('should call in PUT method', () => {
        apiClient.put(UrlBuilder.createFromUrl(url), { foo: 'bar' }).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ foo: 'bar' });
        expect(req.request.url).toBe(url);
    });

    it('should call in PATCH method', () => {
        apiClient.patch(UrlBuilder.createFromUrl(url), { foo: 'bar' }).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ foo: 'bar' });
        expect(req.request.url).toBe(url);
    });

    it('should call in POST method', () => {
        apiClient.post(UrlBuilder.createFromUrl(url), { foo: 'bar' }).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ foo: 'bar' });
        expect(req.request.url).toBe(url);
    });

    it('should call in DELETE method', () => {
        apiClient.delete(UrlBuilder.createFromUrl(url)).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        expect(req.request.method).toBe('DELETE');
        expect(req.request.url).toBe(url);
    });
});
