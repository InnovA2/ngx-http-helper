import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthInterceptor } from './auth-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Config } from './config';


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
                    multi: true,
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                },
                {
                    provide: Config,
                    useValue: config
                }
            ]
        }
    }
}
