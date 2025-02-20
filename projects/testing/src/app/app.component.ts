import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService.findAll().subscribe(console.log);
    }
}
