import {TestBed} from '@angular/core/testing';
import {RestService} from './rest.service';

describe('BookService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: RestService<any> = TestBed.inject(RestService);
        expect(service).toBeTruthy();
    });
});
