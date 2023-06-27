import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Config } from './config';
import { ApiClient } from './api/client/api.client';
import { RestService } from './api/rest/rest.service';


@NgModule({
    declarations: [],
    imports: [],
    exports: []
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
