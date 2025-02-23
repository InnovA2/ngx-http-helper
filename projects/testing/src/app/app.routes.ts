import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from '../../../ngx-http-helper/src/lib/auth/guard/auth.guard';
import { OtherComponent } from './components/other/other.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuard()]
    },
    {
        path: 'other',
        component: OtherComponent,
        canActivate: [authGuard('/other', 'other')]
    },
    {
        path: 'login',
        component: LoginComponent,
    }
];
