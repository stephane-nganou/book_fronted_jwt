import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { BooksComponent } from './pages/books/books.component';
import { MyBooksComponent } from './pages/books/my-books/my-books.component';
import { ManageBookComponent } from './pages/books/manage-book/manage-book.component';
import { BorrowBooksComponent } from './pages/books/borrow-books/borrow-books.component';
import { AuthGuard } from './services/guard/auth-guard';


export const routes: Routes = [

    { path: 'login', component: LoginComponent, title: 'Login page' },
    { path: 'register', component: RegisterComponent, title: 'Register page' },
    { path: 'activate-account', component: ActivateAccountComponent, title: 'Activattion page' },

    {
        path: 'books',
        component: BooksComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_USER'] },
        children: [
            { path: '', redirectTo: 'books', pathMatch: 'full', title: 'Books-Store' },
            { path: 'borrow-books', component: BorrowBooksComponent, title: 'My borrowed books' },
            { path: 'my-books', component: MyBooksComponent, title: 'My Books' },
            { path: 'manage', component: ManageBookComponent, title: 'Manage Books' },
            { path: 'bomanage/:bookId', component: ManageBookComponent, title: 'Manage Book' }
        ]
    },

    {path: '**', component: NotfoundComponent, title: 'PAGE NOT FOUND'}
    
];
