import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_USERS } from './consts';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
        this.http.get(API_USERS).subscribe(() => {});
    }
}
