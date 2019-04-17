import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { CustomersComponent } from './views/customers/customers.component';
import { PageNotFoundComponentComponent } from './views/page-not-found-component/page-not-found-component.component';
import { CustomerselectionComponent } from './componentcontrols/customerselection/customerselection.component';
import { MenuComponent } from './componentcontrols/menu/menu.component';
import { HeadersComponent } from './views/headers/headers.component';
import { LegalComponent } from './componentcontrols/legal/legal.component';
import { JointcommitteeComponent } from './componentcontrols/jointcommittee/jointcommittee.component';
import { CountriesComponent } from './componentcontrols/countries/countries.component';
import { StatuteComponent } from './componentcontrols/statute/statute.component';
import { WorkCodesComponent } from './componentcontrols/workcodes/workcodes.component';

const routes: Routes = [
  {path: '404', component: PageNotFoundComponentComponent },
  {path: 'home', component: HomeComponent},
  {path: 'customer', component: CustomersComponent},
  {path: 'customer/:id', component: CustomersComponent},
  {path: 'customer/add', component: CustomersComponent},
  {path: 'customer/edit', component: CustomersComponent},
  {path: 'settings', component: CustomersComponent},
  {path: 'scheduler', component: CustomersComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export const routingComponents = [
    CustomersComponent,
    HomeComponent,
    MenuComponent,
    PageNotFoundComponentComponent,
    HeadersComponent,
    CustomerselectionComponent,
    LegalComponent,
    JointcommitteeComponent,
    CountriesComponent,
    StatuteComponent,
    WorkCodesComponent
];