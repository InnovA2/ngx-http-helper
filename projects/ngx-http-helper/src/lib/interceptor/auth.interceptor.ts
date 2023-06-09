import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { first, mergeMap, Observable } from 'rxjs';
import { Config, IAuthConfig } from '../config';
import { UrlBuilder } from '@innova2/url-builder';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private config: Config) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authConfig = this.findAuthConfig(req.url);

        if (!authConfig) {
            return next.handle(req);
        }

        return authConfig.tokenSelector().pipe(
            first(),
            mergeMap(token => {
                if (token) {
                    req = req.clone({
                        setHeaders: {
                            [authConfig.header || 'Authorization']: authConfig.scheme ? `${authConfig.scheme} ${token}` : token,
                        }
                    });
                }

                return next.handle(req);
            })
        );
    }

    private findAuthConfig(url: string): IAuthConfig | undefined {
        const targetedDomain = UrlBuilder.createFromUrl(url).getHost();

        return this.config.authenticators.find(c => {
            if (!c.domains || !c.domains.length) {
                return true;
            }

            return c.domains
                .map(d => UrlBuilder.createFromUrl(d).getHost())
                .some(host => host === targetedDomain);
        });
    }

}
