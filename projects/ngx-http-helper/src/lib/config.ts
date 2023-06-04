import { Observable } from 'rxjs';

export interface IAuthConfig {
    tokenSelector: () => Observable<string>;
    header?: string;
    scheme?: string;
    domains?: string[];
}

export class Config {
    authConfigs: IAuthConfig[] = [];
}
