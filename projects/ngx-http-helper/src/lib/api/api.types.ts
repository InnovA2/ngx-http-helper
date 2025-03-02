type Param = string | number | boolean;
type Params = Record<string, Param>;

export interface IApiClientOpts {
    baseUrlKey?: string;
    [key: string]: any;
}

export declare interface IBaseApiOptions {
    params?: Params;
    queryParams?: Params;
    resourceUri?: string;
}

export declare interface IFindOptions extends IBaseApiOptions {
}

export declare interface IFindAllOptions extends IFindOptions {
    q?: string | Params;
}

export declare interface IPaginatedData<T> {
    totalItems: number;
    items: T[];
    totalPages: number;
    currentPage: number;
    hasPreviousPage: boolean;
    hasNextPage: number;
}
