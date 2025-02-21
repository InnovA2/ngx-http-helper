import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AUTH_INTERCEPTOR_CONFIG_TOKEN } from '../http-helper.tokens';
import { IAuthInterceptorConfig } from '../http-helper';

describe('TokenInterceptor', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const init = (config: IAuthInterceptorConfig) => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: AUTH_INTERCEPTOR_CONFIG_TOKEN,
                    useValue: config,
                },
                {
                    multi: true,
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    };

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should do nothing', () => {
        // Arrange
        init({ authenticators: [] });

        // Act
        httpClient.get('/test').subscribe(() => {});
        const req = httpTestingController.expectOne('/test');

        // Assert
        expect(req.request.headers.has('Authorization')).toBeFalse();
    });

    it('should add authorization header (all domains)', () => {
        // Arrange
        init({
            authenticators: [{
                tokenSelector: () => of('MY_TOKEN')
            }],
        });

        // Act
        httpClient.get('/test').subscribe(() => {});
        const req = httpTestingController.expectOne('/test');

        // Assert
        expect(req.request.headers.has('Authorization')).toBeTrue();
    });

    it('should add authorization header (specific domain)', () => {
        // Arrange
        init({
            authenticators: [{
                tokenSelector: () => of('MY_TOKEN'),
                domains: ['http://localhost']
            }],
        });

        // Act
        httpClient.get('http://test/test').subscribe(() => {});
        const req = httpTestingController.expectOne('http://test/test');

        // Assert
        expect(req.request.headers.has('Authorization')).toBeFalse();

        // Act
        httpClient.get('http://localhost/test').subscribe(() => {});
        const req2 = httpTestingController.expectOne('http://localhost/test');

        // Assert
        expect(req2.request.headers.has('Authorization')).toBeTrue();
    });

    it('should add bearer authorization header', () => {
        // Arrange
        init({
            authenticators: [{
                tokenSelector: () => of('MY_TOKEN'),
                scheme: 'Bearer',
            }],
        });

        // Act
        httpClient.get('/test').subscribe(() => {});
        const req2 = httpTestingController.expectOne('/test');

        // Assert
        expect(req2.request.headers.has('Authorization')).toBeTrue();
        expect(req2.request.headers.get('Authorization')).toBe('Bearer MY_TOKEN');
    });
});
