type Param = string | number | boolean;
export type Params = Record<string, Param>;

interface IApiClientOpts<T> {
    baseUrlKey?: keyof T;
    [key: string]: any;
}

export interface IBaseApiOptions {
    params?: Params;
    queryParams?: Params;
    resourceUri?: string;
}

export interface IFindOptions extends IBaseApiOptions {
}

export interface IFindAllOptions extends IFindOptions {
    q?: string | Params;
}
