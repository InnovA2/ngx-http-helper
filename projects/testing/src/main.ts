import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideHttpHelper, withAuth } from '../../ngx-http-helper/src/public-api';
import { API_URL } from './app/consts';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

/**
 * TODO :
 * - créer un provider qui contient le payload du token (si possible car async -> tester la conversion en signal)
 * - définir à une seul endroit les tokenSelectors (de ma même manière que les baseUrls)
 */

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideRouter(routes),
        provideHttpClient(), // todo : add interceptor
        provideHttpHelper({
            baseUrls: {
                default: API_URL,
            },
        }, withAuth({
            tokenSelectors: {
                default: () => of('Bearer jwt_test'),
                other: () => of(undefined),
            },
            authenticators: [{
                tokenSelectorKey: 'default',
            }],
        })),
    ]
})
  .catch(err => console.error(err));
