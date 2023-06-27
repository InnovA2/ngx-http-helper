import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Config } from '../config';
import { of } from 'rxjs';

describe('TokenInterceptor', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const init = (config: Config) => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: Config,
                    useValue: config,
                },
                {
                    multi: true,
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                }
            ],
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    };

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should do nothing', () => {
        init({ authenticators: [], client: {} });

        httpClient.get('/test').subscribe(() => {});
        const req = httpTestingController.expectOne('/test');

        expect(req.request.headers.has('Authorization')).toBeFalse();
    });

    it('should add authorization header (all domains)', () => {
        init({
            authenticators: [{
                tokenSelector: () => of('MY_TOKEN')
            }],
            client: {},
        });

        httpClient.get('/test').subscribe(() => {});
        const req = httpTestingController.expectOne('/test');

        expect(req.request.headers.has('Authorization')).toBeTrue();
    });

    it('should add authorization header (specific domain)', () => {
        init({
            authenticators: [{
                tokenSelector: () => of('MY_TOKEN'),
                domains: ['http://localhost']
            }],
            client: {},
        });

        httpClient.get('http://test/test').subscribe(() => {});
        const req = httpTestingController.expectOne('http://test/test');

        expect(req.request.headers.has('Authorization')).toBeFalse();

        httpClient.get('http://localhost/test').subscribe(() => {});
        const req2 = httpTestingController.expectOne('http://localhost/test');

        expect(req2.request.headers.has('Authorization')).toBeTrue();
    });

    it('should add bearer authorization header', () => {
        init({
            authenticators: [{
                tokenSelector: () => of('MY_TOKEN'),
                scheme: 'Bearer',
            }],
            client: {},
        });

        httpClient.get('/test').subscribe(() => {});
        const req2 = httpTestingController.expectOne('/test');

        expect(req2.request.headers.has('Authorization')).toBeTrue();
        expect(req2.request.headers.get('Authorization')).toBe('Bearer MY_TOKEN');
    });
});
