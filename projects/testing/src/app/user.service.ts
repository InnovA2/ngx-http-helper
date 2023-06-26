import { Injectable } from '@angular/core';
import { RestService } from '../../../ngx-http-helper/src/lib/api/rest/rest.service';

interface User {
    id: string;
    name: string;
    avatar: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService extends RestService<User> {
    protected override readonly resourceUri = 'users';
}
