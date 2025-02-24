import { authInterceptor } from './auth.interceptor';
import { HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AUTH_FEATURE_CONFIG_TOKEN } from '../../http-helper.tokens';
import { IAuthFeatureConfig } from '../../http-helper';

describe('TokenInterceptor', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const init = (config?: IAuthFeatureConfig) => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: AUTH_FEATURE_CONFIG_TOKEN,
                    useValue: config,
                },
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting()
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    };

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should throw error', () => {
        // Arrange
        init();

        // Act
        httpClient.get('/test').subscribe({
            next: () => {},
            error: (error) => {
                // Assert
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toContain('The auth config does not exist. Please declare it from the withAuth()');
            },
          });
    });

    it('should add authorization header (all domains)', () => {
        // Arrange
        init({
            tokenSelectors: {
                default: () => of('MY_TOKEN')
            },
            authenticators: [{
                // default selector
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
            tokenSelectors: {
                default: () => of(undefined),
                other: () => of('MY_TOKEN'),
            },
            authenticators: [{
                tokenSelectorKey: 'other',
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
            tokenSelectors: {
                default: () => of('MY_TOKEN'),
            },
            authenticators: [{
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
