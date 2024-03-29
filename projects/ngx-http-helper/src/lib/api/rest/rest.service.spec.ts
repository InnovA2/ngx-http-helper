import { TestBed } from '@angular/core/testing';
import { RestService } from './rest.service';
import { ApiClient } from '../client/api.client';
import { EMPTY, Observable, of } from 'rxjs';
import { Config } from '../../config';
import { UrlBuilder } from '@innova2/url-builder';
import { Injectable } from '@angular/core';
import { PaginatedData } from './paginated-data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from 'ionic-cache';
import { HttpHeaders } from '@angular/common/http';

interface User {
    id: number;
    name: string;
    roleId: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserService extends RestService<User> {
    protected override readonly resourceUri = 'users';

    findAllByRoleId(roleId: number) {
        return this.findAll({
            resourceUri: 'roles/:roleId/users',
            params: { roleId }
        });
    }
}

describe('RestService', () => {
    const user: User = {
        id: 1,
        name: 'foo',
        roleId: 1,
    }

    let apiClient: ApiClient;
    let userService: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, CacheModule.forRoot()],
            providers: [
                {
                    provide: Config,
                    useValue: {
                        client: {
                            baseUrl: 'http://localhost'
                        }
                    },
                },
                ApiClient,
                UserService
            ],
        });

        apiClient = TestBed.inject(ApiClient);
        userService = TestBed.inject(UserService);
    });

    describe('findAll tests', () => {
        it('should findAll', (done) => {
            spyOn(apiClient, 'get').and.returnValue(of({ body: [user] }) as any);

            userService.findAll().subscribe(res => {
                expect(res).toEqual([user]);
                done();
            });
        });

        it('should findAll by string filter', (done) => {
            spyOn(apiClient, 'get').and.returnValue(of({ body: [user] }) as any);

            userService.findAll({ q: 'foo' }).subscribe(res => {
                expect(res).toEqual([user]);
                done();
            });
        });

        it('should findAll by object filter', (done) => {
            spyOn(apiClient, 'get').and.returnValue(of({ body: [user] }) as any);

            userService.findAll({ q: { name: 'foo' } }).subscribe(res => {
                expect(res).toEqual([user]);
                done();
            });
        });

        it('should findAll paginated', (done) => {
            const page = new PaginatedData<User>();
            page.totalItems = 1;
            page.totalPages = 1;

            spyOn(apiClient, 'get').and.returnValue(of({ body: page }) as any);

            userService.findAll(1).subscribe(res => {
                expect(res).toBeInstanceOf(PaginatedData);
                expect(res.totalItems).toBe(1);
                expect(res.totalPages).toBe(1);
                done();
            });
        });

        it('should findAll with specific resourceUri', (done) => {
            spyOn(apiClient, 'get').and.callFake(url => of({ body: url.getRelativePath() }) as any);

            (userService.findAllByRoleId(1) as Observable<any>).subscribe(res => {
                expect(res).toEqual('/roles/1/users');
                done();
            });
        });
    });

    it('should find specific user', (done) => {
        spyOn(apiClient, 'get').and.returnValue(of({ body: user }) as any);

        userService.findById(1).subscribe(res => {
            expect(res).toEqual(user);
            done();
        });
    });

    describe('create tests', () => {
        const newUser = { id: 2, name: 'bar', roleId: 1 };

        it('should create a new user', (done) => {
            spyOn(apiClient, 'post').and.returnValue(of({ body: newUser }) as any);

            userService.create(newUser).subscribe(res => {
                expect(res).toEqual(newUser);
                done();
            });
        });

        it('should create a new user with queryParams', (done) => {
            spyOn(apiClient, 'post').and.returnValue(of({ body: newUser }) as any);

            userService.create(newUser, {
                queryParams: { type: 'test' }
            }).subscribe(res => {
                expect(res).toEqual(newUser);

                const expectedUrl = UrlBuilder.createFromUrl('http://localhost/users?type=test');
                expect(apiClient.post).toHaveBeenCalledWith(expectedUrl, newUser);
                done();
            });
        });

        it('should create a new user and call identifier', (done) => {
            spyOn(apiClient, 'post').and.returnValue(of({ body: newUser, headers: new HttpHeaders({ location: '/users/2' }) }) as any);
            spyOn(apiClient, 'get').and.returnValue(of({ body: newUser }) as any);

            userService.create(newUser, {}, true).subscribe(res => {
                expect(res).toEqual(newUser);
                expect(apiClient.get).toHaveBeenCalled();
                done();
            });
        });
    });

    it('should update an existing user', (done) => {
        const updatedUser = { ...user, name: 'bar' };
        spyOn(apiClient, 'patch').and.returnValue(of({ body: updatedUser }) as any);

        userService.update('1', { name: 'bar' }).subscribe(res => {
            expect(res).toEqual(updatedUser);
            done();
        });
    });

    it('should delete an existing user', (done) => {
        spyOn(apiClient, 'delete').and.returnValue(of({ body: EMPTY } as any));

        userService.delete('1').subscribe(() => {
            expect(apiClient.delete).toHaveBeenCalled();
            done();
        });
    });
});
