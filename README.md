# ngx-http-helper

A lightweight library to easily call your APIs and add JWT token or API key on each header request

- [Features](#bookmark_tabs-features)
- [Installation](#hammer_and_wrench-installation)
- [Usage](#memo-usage)
- [API](#gear-api)
- [Licence](#balance_scale-licence)
- [Authors](#busts_in_silhouette-authors)
- [Contributors](#handshake-contributors)

## :bookmark_tabs: Features
This library allows :
- Intercept http calls by domain to add your API key, JWT token...
- Simplify http calls with ApiClient
- Simplify RESTful calls with RestService

## :hammer_and_wrench: Installation
To import the library you just need to run this command :
```shell
ng add @innova2/ngx-http-helper
```

You need to install UrlBuilder to use this library
```shell
npm install @innova2/url-builder
```

## :memo: Usage
Import the module and configure it according to your choices.
```ts
@NgModule({
    ...
    imports: [
        ...
        NgxHttpHelperModule.forRoot({})
    ],
})
export class AppModule {}
```

### Intercept calls to inject API key, token...
You can specify multiple interceptors by domain(s) and token.
For example, if you need to add an API key to the domain 'foo.sample.com' and a JWT to 'bar.sample.com':
```ts
NgxHttpHelperModule.forRoot({
    authenticators: [{
        tokenSelector: () => of('My API Key'),
        domains: ['https://foo.sample.com'],
        // This add the 'My API Key' to 'Authorization' header of each request to 'https://foo.sample.com'
    }, {
        tokenSelector: () => of('My JWT Token'),
        scheme: 'Bearer',
        domains: ['https://bar.sample.com'],
        // This add the 'Bearer My JWT Token' to 'Authorization' header of each request to 'https://bar.sample.com'
    }],
})
```

As you can see, to transmit your token or API key, you must create the 'tokenSelector' function and return an observable of your token.
Also, you can target specific domains for each token.

For JWT token, you can add scheme 'Bearer' (or another) to prefix the token (e.g. Bearer My JWT Token).

You can also change the header name by setting the property 'header'.
```ts
NgxHttpHelperModule.forRoot({
    authenticators: [{
        tokenSelector: () => of('My API Key'),
        domains: ['https://foo.sample.com'],
        header: 'X-Api-Key'
    }],
})
```

### Use ApiClient instead of HttpClient
The ApiClient provide methods to call HttpClient easily:
- get : with optional cache
- put
- patch
- post
- delete

The 'Content-Type' is automatically set to 'application/json' and the 'observe' is set to 'response'.
You can override all options with the 'opts' params of methods:

```ts
import { ApiClient } from '@innova2/ngx-http-helper';
import { UrlBuilder } from '@innova2/url-builder';

@Component(...)
class ListUsersComponent {
    url = UrlBuilder.createFromUrl('https://foo.sample.com/users');

    constructor(private apiClient: ApiClient) {}

    getUsers() {
        const cache = {
            ttl: 10, // in seconds (ngx-http-helper use ionic-cache)
            group: 'users'
        };
        const options = {
            'Content-Type': 'application/xml' // if you want to override json ContentType
            // All options are those provided by Angular's HttpClient
        };

        this.apiClient.get(this.url, cache, options).subscribe(users => ...);
    }

    addUser(user: User) {
        this.apiClient.post(this.url, user).subscribe(() => ...);
    }
}
```

If you must catch all http errors, you can set the 'catch' property to the module configuration:
```ts
NgxHttpHelperModule.forRoot({
    client: [{
        catch: (err) => {
            console.log('Oh snap, an error occured', err);
            throwError(() => ({
                ...err,
                foo: 'bar'
            }));
        }
    }],
})
```

### Use RestService to easily call your API RESTful
To use this service, you need to create your own child of RestService. Don't call directly the RestService.

Configure it from the module configuration:
```ts
NgxHttpHelperModule.forRoot({
    client: [{
        baseUrl: 'https://foo.sample.com',
        defaultCacheTTL: 100
    }],
})
```

See this example:
```ts
import { RestService } from '@innova2/ngx-http-helper';

interface User {
    id: string;
    name: string;
    avatar: string;
    createdAt: string;
}

@Injectable(...)
export class UserService extends RestService<User> {
    protected override readonly resourceUri = 'users';
}
```
Then, call your service:
```ts
@Component(...)
class ListUsersComponent {
    constructor(private userService: UserService) {}

    getUsers() {
        this.userService.findAll().subscribe(users => ...);
        // This automatically call in GET method the 'https://foo.sample.com/users'
        
        // If your web service is paginated
        const numPage = 1;
        this.userService.findAll(numPage).subscribe(page => ...);
    }
    
    getUser(id: string) {
        this.userService.findById(id).subscribe(user => ...);
    }

    addUser(user: User) {
        this.userService.create(user).subscribe(() => ...);
        
        // In RESTful, your web service does not return the user but add the 'location' header to the response
        // If you want automatically can this location to retrieve the created user,
        // you can do it by passing the parameter 'callIdentifier' to true
        this.userService.create(user, {}, {}, true).subscribe((user) => ...);
    }
}
```

## :gear: API
### Config
```ts
export interface IAuthConfig {
    tokenSelector: () => Observable<string>;
    header?: string;
    scheme?: string;
    domains?: string[];
}

export interface IClientConfig {
    baseUrl?: string;
    defaultCacheTTL?: number;
    catch?: (err: any, caught: Observable<any>) => ObservableInput<any>;
}

export class Config {
    authenticators: IAuthConfig[] = [];
    client: IClientConfig = {};
}
```

### ApiClient
```ts
get<T>(url: UrlBuilder, cache?: CacheOptions, opts?: any): Observable<HttpResponse<T>>
post<T>(url: UrlBuilder, data: any, opts?: any): Observable<HttpResponse<T>>
put<T>(url: UrlBuilder, data: any, opts?: any): Observable<HttpResponse<T>>
patch<T>(url: UrlBuilder, data: any, opts?: any): Observable<HttpResponse<T>>
delete<T>(url: UrlBuilder, data?: any, opts?: any): Observable<HttpResponse<T>>
```

### UrlUtils (namespace)
```ts
protected readonly baseUrl = this.config.client.baseUrl;
protected readonly resourceUri!: string;

findAll(opts?: FindAllOptions): Observable<O[]>;
findAll(page: number, opts?: FindAllOptions): Observable<PaginatedData<O>>;
findAll(pageOrOpts?: number | FindAllOptions, opts?: FindAllOptions): any;
findById(id: string | number, opts: FindOptions = {}): Observable<O>;
create(data: Partial<I>, params?: Params, queryParams?: Params, callIdentifier = false): Observable<O>;
update(id: string, data: Partial<I>, params?: Params): Observable<O>;
delete(id: string, params?: Record<string, string | number>, data?: Partial<I>): Observable<HttpResponse<void>>;
protected initializeCacheOptions = (url: UrlBuilder, ttl?: number): CacheOptions;
```

The initializeCacheOptions return by default:
```ts
{
    group: url.getRelativePath(),
    ttl: ttl ?? this.config.client.defaultCacheTTL ?? 0,
}
```
*Note: You can override this function.*

## :balance_scale: Licence
[MIT](LICENSE)

## :busts_in_silhouette: Authors
- [Adrien MARTINEAU](https://github.com/WaZeR-Adrien)
- [Angéline TOUSSAINT](https://github.com/AngelineToussaint)

## :handshake: Contributors
Do not hesitate to participate in the project!
Contributors list will be displayed below.
