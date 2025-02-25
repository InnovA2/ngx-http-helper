type Param = string | number | boolean;
export type Params = Record<string, Param>;

interface IApiClientOpts {
    baseUrlKey?: string;
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

export interface IPaginatedData<T> {
    totalItems: number;
    items: T[];
    totalPages: number;
    currentPage: number;
    hasPreviousPage: boolean;
    hasNextPage: number;
}
