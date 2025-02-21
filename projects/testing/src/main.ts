import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideHttpHelper } from '../../ngx-http-helper/src/public-api';
import { API_URL } from './app/consts';


bootstrapApplication(AppComponent, {
    providers: [importProvidersFrom(BrowserModule), provideHttpClient(withInterceptorsFromDi()), provideHttpHelper({
        baseUrls: {
            default: API_URL,
        },
    })]
})
  .catch(err => console.error(err));
