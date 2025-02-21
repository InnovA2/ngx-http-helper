import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { API_URL } from './app/consts';
import { AppComponent } from './app/app.component';
import { provideHttpHelper } from '../../ngx-http-helper/src/public-api';


bootstrapApplication(AppComponent, {
    providers: [importProvidersFrom(BrowserModule), provideHttpClient(withInterceptorsFromDi()), provideHttpHelper({
        client: {
            baseUrl: API_URL,
        },
    })]
})
  .catch(err => console.error(err));
