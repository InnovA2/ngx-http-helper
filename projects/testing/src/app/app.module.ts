import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { API_URL } from './consts';
import { NgxHttpHelperModule } from '../../../ngx-http-helper/src/public-api';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NgxHttpHelperModule.forRoot({
            authenticators: [{
                tokenSelector: () => of('test'),
                scheme: 'Bearer',
                domains: ['https://foo.bar'],
            },{
                tokenSelector: () => of('My Token'),
                scheme: 'Bearer',
                domains: [API_URL]
            }],
            client: {
                baseUrl: API_URL,
            },
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
