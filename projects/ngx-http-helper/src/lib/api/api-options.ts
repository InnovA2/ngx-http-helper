export interface CacheOptions {
    group: string;
    ttl: number;
}

export type Params = Record<string, string | number | boolean>;

export interface FindOptions {
    params?: Params;
    queryParams?: Params;
    ttl?: number;
}

export interface FindAllOptions extends FindOptions {
    q?: string | Params;
}
