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
- Add Auth Guard to your routes
- Simplify HTTP calls with ApiClient (use baseUrl, default headers, global catch, etc.)
- Simplify RESTful calls with RestService (predefined methods for RESTful routes, like /users with findAll(), /users/:id with findById())

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
Import the provideHttpHelper() and configure it according to your choices.
```ts
import { provideHttpHelper } from '@innova2/ngx-http-helper';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(), // Mandatory to use ApiClient and RestService
        provideHttpHelper({
            baseUrls: {
                default: API_URL, // default baseUrl is mandatory (it's used by ApiClient and RestService by default)
                // you can defined other baseUrl
            },
        }),
    ]
});
```

### Use ApiClient instead of HttpClient
The ApiClient provide methods to call HttpClient easily:
- get
- put
- patch
- post
- delete

The 'Content-Type' is automatically set to 'application/json' and the 'observe' is set to 'response'.
You can override all options with the 'opts' params of methods. See below:

```ts
import { ApiClient } from '@innova2/ngx-http-helper';
import { UrlBuilder } from '@innova2/url-builder';

@Component(...)
class ListUsersComponent {
    apiClient = inject(ApiClient);

    getUsers() {
        const options = {
            'Content-Type': 'application/xml' // if you want to override json ContentType
            // All options are those provided by Angular's HttpClient + baseUrlKey which is the key of any baseUrl defined in the provideHttpHelper()
        };

        this.apiClient.get('/users', options).subscribe(users => ...);
    }

    addUser(user: User) {
        this.apiClient.post('/users', user).subscribe(() => ...);
    }
}
```

With another baseUrl:
```ts
import { provideHttpHelper } from '@innova2/ngx-http-helper';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideHttpHelper({
            baseUrls: {
                default: API_URL,
                otherApi: API_OTHER_URL,
            },
        }),
    ]
});
```
```ts
import { ApiClient } from '@innova2/ngx-http-helper';
import { UrlBuilder } from '@innova2/url-builder';

@Component(...)
class ListUsersComponent {
    apiClient = inject(ApiClient);

    getUsers() {
        const options = {
            baseUrlKey: 'other',
        };

        this.apiClient.get('/users', options).subscribe(users => ...);
        // It call API_OTHER_URL + /users
    }
}
```

If you must catch all http errors, you can set the 'catch' property to the module configuration:
```ts
import { provideHttpHelper } from '@innova2/ngx-http-helper';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideHttpHelper({
            baseUrls: {
                default: API_URL,
                otherApi: API_OTHER_URL,
            },
            catch: (err) => {
                console.log('Oh snap, an error occured', err);
                return throwError(() => ({
                    ...err,
                    foo: 'bar'
                }));
            }
        }),
    ]
});
```

### Use RestService to easily call your API RESTful
To use this service, you need to create your own child of RestService. Don't call directly the RestService.

Configure it from the module configuration:
```ts
import { provideHttpHelper } from '@innova2/ngx-http-helper';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideHttpHelper({
            baseUrls: {
                default: 'https://foo.sample.com',
                otherApi: 'https://another.sample.com',
            },
        }),
    ]
});
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
By default, it's the default baseUrl that is called.
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

You can override the resourceUri for specific call if needed:
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

    findAllByRoleId(roleId: number) {
        return this.findAll({
            resourceUri: 'roles/:roleId/users',
            params: { roleId }
        });
    }
}
```
We are not using the 'resourceUri' class property here, but instead we are using that provided as a function argument 'opts' (options).


You can also override the baseUrl called by overriding property baseUrlKey:
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
    protected override readonly baseUrlKey = 'otherApi';
}
```

### Intercept calls to inject API key, token...
You can specify multiple interceptors by domain(s) and token.
For example, if you need to add an API key to the domain 'foo.sample.com' and a JWT to 'bar.sample.com':
```ts
import { authInterceptor, provideHttpHelper, withAuth } from '@innova2/ngx-http-helper';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpHelper(
            {},
            withAuth({ // withAuth is mandatory to use AuthInterceptor and AuthGuard
                tokenSelectors: {
                    default: () => of('My API Key'),
                    other: () => of('My JWT Token'),
                },
                authenticators: [{
                    // Here, the default tokenSelector is used
                    domains: ['https://foo.sample.com'],
                    // This add the 'Bearer My JWT Token' to 'Authorization' header of each request to 'https://foo.sample.com'
                }, {
                    tokenSelectorKey: 'other',
                    scheme: 'Bearer',
                    domains: ['https://bar.sample.com'],
                    // This add the 'Bearer My JWT Token' to 'Authorization' header of each request to 'https://bar.sample.com'
                }],
            });
        ),
    ]
});
```

As you can see, to transmit your token or API key, you must create the 'tokenSelector' function and return an observable of your token.
Also, you can target specific domains for each token.
*Note: You can target all domains by removing the 'domains' property.*
*Note 2: An empty object "{}" in authenticators, add the interceptor for all domain with the default tokenSelector

For JWT token, you can add scheme 'Bearer' (or another) to prefix the token (e.g. Bearer My JWT Token).

You can also change the header name by setting the property 'header'.
```ts
import { authInterceptor, provideHttpHelper, withAuth } from '@innova2/ngx-http-helper';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpHelper(
            {},
            withAuth({ // withAuth is mandatory to use AuthInterceptor and AuthGuard
                tokenSelectors: {
                    default: () => of('My API Key'),
                },
                authenticators: [{
                    domains: ['https://foo.sample.com'],
                    header: 'X-Api-Key'
                }],
            });
        ),
    ]
});
```

## :gear: API
### Config
```ts
// Config of provideHttpHelper()
interface IHttpHelperConfig {
    baseUrls: IBaseUrls;
    catch?: (err: any, caught: Observable<any>) => ObservableInput<any>;
}

interface IBaseUrls {
    default: string;
    [key: string]: string;
}

// Config of withAuth()
type TokenInterceptor = () => Observable<string | null | undefined>;

interface ITokenSelectors {
    default: TokenInterceptor;
    [key: string]: TokenInterceptor;
}

interface IAuthenticator {
    tokenSelectorKey?: string;
    header?: string;
    scheme?: string;
    domains?: string[];
}

interface IAuthGuard {
    redirectRoute?: string;
}

interface IAuthFeatureConfig {
    tokenSelectors: ITokenSelectors;
    authenticators: IAuthenticator[];
    guard?: IAuthGuard;
}
```

### ApiClient
```ts
interface IApiClientOpts<T> {
    baseUrlKey?: keyof T;
    [key: string]: any;
}

class ApiClient {
    get<T>(url: UrlBuilder, IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>>
    post<T>(url: UrlBuilder, data: any, IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>>
    put<T>(url: UrlBuilder, data: any, IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>>
    patch<T>(url: UrlBuilder, data: any, IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>>
    delete<T>(url: UrlBuilder, data?: any, IApiClientOpts<typeof this.config.baseUrls> = {}): Observable<HttpResponse<T>>
}
```

### RestService
```ts
interface IBaseApiOptions {
    params?: Params;
    queryParams?: Params;
    resourceUri?: string;
}

interface IFindOptions extends IBaseApiOptions {
}

interface IFindAllOptions extends IFindOptions {
    q?: string | Params;
}

interface IPaginatedData<T> {
    totalItems: number;
    items: T[];
    totalPages: number;
    currentPage: number;
    hasPreviousPage: boolean;
    hasNextPage: number;
}

// O = Output
// I = Input
// P = Paginated data
class RestService<O, I = O, P = IPaginatedData<O>> {
    protected readonly baseUrlKey = 'default';
    protected readonly resourceUri!: string;

    findAll(opts?: FindAllOptions): Observable<O[]>;
    findAll(page: number, opts?: FindAllOptions): Observable<PaginatedData<O>>;
    findAll(pageOrOpts?: number | FindAllOptions, opts?: FindAllOptions): any;
    findById(id: string | number, opts: FindOptions = {}): Observable<O>;
    create(data: Partial<I>, opts: BaseApiOptions = {}, callIdentifier = false): Observable<O>;
    update(id: string, data: Partial<I>, opts: BaseApiOptions = {}): Observable<O>;
    delete(id: string, opts: BaseApiOptions = {}, data?: Partial<I>): Observable<HttpResponse<void>>;
}
```

## :balance_scale: Licence
[MIT](LICENSE)

## :busts_in_silhouette: Authors
- [Adrien MARTINEAU](https://github.com/WaZeR-Adrien)
- [Angéline TOUSSAINT](https://github.com/AngelineToussaint)

## :handshake: Contributors
Do not hesitate to participate in the project!
Contributors list will be displayed below.
