import { Observable, ObservableInput } from 'rxjs';

export interface IAuthConfig {
    tokenSelector: () => Observable<string>;
    header?: string;
    scheme?: string;
    domains?: string[];
}

export interface IClientConfig {
    catch?: (err: any, caught: Observable<any>) => ObservableInput<any>;
}

export class Config {
    authenticators: IAuthConfig[] = [];
    client: IClientConfig = {};
}
