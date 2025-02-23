import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from '../../../ngx-http-helper/src/lib/auth/guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuard('/login')]
    },
    {
        path: 'login',
        component: LoginComponent,
    }
];
