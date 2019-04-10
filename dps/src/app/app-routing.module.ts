import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CustomersComponent } from './customers/customers.component';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';

const routes: Routes = [
  {path: '404', component: PageNotFoundComponentComponent },
  {path: 'home',component:HomeComponent},
  {path: 'customer',component:CustomersComponent},
  {path: 'customer/:id',component:CustomersComponent},
  {path: 'customer/add',component:CustomersComponent},
  {path: 'customer/edit',component:CustomersComponent},
  {path: 'settings',component:CustomersComponent},
  {path: 'scheduler',component:CustomersComponent},
  {path: '', redirectTo: '/home',pathMatch: 'full'},
  {path: '**', redirectTo: '/404',pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
