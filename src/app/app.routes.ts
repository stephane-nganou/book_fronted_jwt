import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { BooksComponent } from './pages/books/books.component';
import { MyBooksComponent } from './pages/books/my-books/my-books.component';

export const routes: Routes = [
    {path: '', component: BooksComponent, title: 'Books-Store'},
    {path: 'books', component: BooksComponent, title: 'Books-Store'},
    {path: 'my-books', component: MyBooksComponent, title: 'My Books'},
    {path: 'activate-account', component: ActivateAccountComponent, title: 'Activattion page'},
    {path: 'login', component: LoginComponent, title: 'Login page'},
    {path: 'register', component: RegisterComponent, title: 'Register page'},
    {path: '**', component: NotfoundComponent, title: 'PAGE NOT FOUND'}
];
