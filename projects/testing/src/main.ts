import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { NgxHttpHelperModule } from '../../ngx-http-helper/src/public-api';
import { of } from 'rxjs';
import { API_URL } from './app/consts';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';


bootstrapApplication(AppComponent, {
    providers: [importProvidersFrom(BrowserModule, NgxHttpHelperModule.forRoot({
            authenticators: [{
                    tokenSelector: () => of('test'),
                    scheme: 'Bearer',
                    domains: ['https://foo.bar'],
                }, {
                    tokenSelector: () => of('My Token'),
                    scheme: 'Bearer',
                    domains: [API_URL]
                }],
            client: {
                baseUrl: API_URL,
            },
        }))]
})
  .catch(err => console.error(err));
