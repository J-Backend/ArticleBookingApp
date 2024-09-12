import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NewLayawayComponent } from './pages/new-layaway/new-layaway.component';
import { EditArticleComponent } from './pages/edit-article/edit-article.component';
import { DetailComponent } from './pages/detail/detail.component';
import { AccountComponent } from './pages/account/account.component';


import { verifyGuard } from './guards/verify.guard';

export const routes: Routes = [
    {path:'home', component:HomeComponent, canActivate:[verifyGuard]},
    
    {path:'login', component:LoginComponent},
    {path:'register', component:LoginComponent},
    {path:'customers', component:CustomerComponent, canActivate:[verifyGuard]},
    {path:'customer/:id', component:ProfileComponent, canActivate:[verifyGuard]},
    {path:'new/:customerId', component:NewLayawayComponent, canActivate:[verifyGuard]},
    {path:'customer/:customerId/:layawayId/:articleId', component:EditArticleComponent, canActivate:[verifyGuard]},
    {path:'customer/:customerId/:layawayId', component:DetailComponent, canActivate:[verifyGuard]},
    {path:'account/:customerId/:layawayId', component:AccountComponent, canActivate:[verifyGuard]},
    { path: '**', redirectTo: 'login' }
];
