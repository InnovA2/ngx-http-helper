import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
    private userService = inject(UserService);

    ngOnInit(): void {
        this.userService.findAll().subscribe(console.log);
        this.userService.generateError().subscribe(() => {});
    }
}
