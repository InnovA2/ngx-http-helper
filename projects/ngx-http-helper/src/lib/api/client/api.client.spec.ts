import { TestBed } from '@angular/core/testing';
import { ApiClient } from './api.client';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UrlBuilder } from '@innova2/url-builder';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_HELPER_CONFIG_TOKEN } from '../../http-helper.tokens';

describe('ApiClientService', () => {
    const url = 'http://localhost';

    let apiClient: ApiClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HTTP_HELPER_CONFIG_TOKEN,
                    useValue: {
                        baseUrls: {
                            default: url
                        },
                        catch: (err: any) => throwError(() => err),
                    },
                },
                ApiClient,
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
        // Act
        apiClient.get(UrlBuilder.createFromUrl(url)).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        // Assert
        expect(req.request.method).toBe('GET');
        expect(req.request.url).toBe(url);
    });

    it('should call in PUT method', () => {
        // Act
        apiClient.put(UrlBuilder.createFromUrl(url), { foo: 'bar' }).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        // Assert
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ foo: 'bar' });
        expect(req.request.url).toBe(url);
    });

    it('should call in PATCH method', () => {
        // Act
        apiClient.patch(UrlBuilder.createFromUrl(url), { foo: 'bar' }).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        // Assert
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ foo: 'bar' });
        expect(req.request.url).toBe(url);
    });

    it('should call in POST method', () => {
        // Act
        apiClient.post(UrlBuilder.createFromUrl(url), { foo: 'bar' }).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        // Assert
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ foo: 'bar' });
        expect(req.request.url).toBe(url);
    });

    it('should call in DELETE method', () => {
        // Act
        apiClient.delete(UrlBuilder.createFromUrl(url)).subscribe(() => {});
        const req = httpTestingController.expectOne(url);

        // Assert
        expect(req.request.method).toBe('DELETE');
        expect(req.request.url).toBe(url);
    });
});
