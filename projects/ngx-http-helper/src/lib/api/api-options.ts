export interface CacheOptions {
    group: string;
    ttl: number;
}

type Param = string | number | boolean;
export type Params = Record<string, Param>;

export interface BaseApiOptions {
    params?: Params;
    queryParams?: Params;
    resourceUri?: string;
}

export interface FindOptions extends BaseApiOptions {
    ttl?: number;
}

export interface FindAllOptions extends FindOptions {
    q?: string | Params;
}
