import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Config } from './config';
import { ApiClient } from './api/client/api.client';
import { RestService } from './api/rest/rest.service';
import { CacheModule } from 'ionic-cache';


@NgModule({
    declarations: [],
    exports: [],
    imports: [CacheModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class NgxHttpHelperModule {
    static forRoot(config: Config): ModuleWithProviders<NgxHttpHelperModule> {
        return {
            ngModule: NgxHttpHelperModule,
            providers: [
                {
                    provide: Config,
                    useValue: config,
                },
                {
                    multi: true,
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                },
                ApiClient,
                RestService
            ]
        }
    }
}
