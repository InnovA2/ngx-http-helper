import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxHttpHelperModule } from '../../../ngx-http-helper/src/lib/ngx-http-helper.module';
import { of } from 'rxjs';
import { API_URL } from './consts';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgxHttpHelperModule.forRoot({
            authConfigs: [{
                tokenSelector: () => of('test'),
                scheme: 'Bearer',
                domains: ['https://foo.bar']
            },{
                tokenSelector: () => of('My Token'),
                scheme: 'Bearer',
                domains: [API_URL]
            }]
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
