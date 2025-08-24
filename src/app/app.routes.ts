import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { MenuComponent } from './pages/menu/menu.component';

export const routes: Routes = [
    {path: '', component: MenuComponent, title: 'menu'},
    {path: 'activate-account', component: ActivateAccountComponent, title: 'Activattion page'},
    {path: 'login', component: LoginComponent, title: 'Login page'},
    {path: 'register', component: RegisterComponent, title: 'Register page'},
    {path: '**', component: NotfoundComponent, title: 'PAGE NOT FOUND'}
];
