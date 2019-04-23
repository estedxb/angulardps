import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerselectionComponent } from './componentcontrols/customerselection/customerselection.component';
import { MenuComponent } from './componentcontrols/menu/menu.component';
import { HeadersComponent } from './componentcontrols/headers/headers.component';
import { LegalComponent } from './componentcontrols/legal/legal.component';
import { JointcommitteeComponent } from './componentcontrols/jointcommittee/jointcommittee.component';
import { CountriesComponent } from './componentcontrols/countries/countries.component';
import { StatuteComponent } from './componentcontrols/statute/statute.component';
import { WorkCodesComponent } from './componentcontrols/workcodes/workcodes.component';
import { ContactpersonComponent } from './contactperson/contactperson.component';
import { LanguagesComponent } from './componentcontrols/languages/languages.component';

import { HeadquartersComponent } from './headquarters/headquarters.component';
import { GeneralComponent } from './general/general.component';
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';

import { HomeComponent } from './views/home/home.component';
import { CustomersComponent } from './views/customers/customers.component';
import { PageNotFoundComponentComponent } from './views/page-not-found-component/page-not-found-component.component';
import { AddpersonComponent } from './views/person/addperson/addperson.component';
import { LoginComponent } from './views/login/login.component';
import { AddCustomerComponent } from './views/customers/add-customer/add-customer.component';
import { UpdateCustomerComponent } from './views/customers/update-customer/update-customer.component';
import { PositionsComponent } from './views/customers/positions/positions.component';
import { UsersComponent } from './views/customers/users/users.component';
import { LocationsComponent } from './views/customers/locations/locations.component';
import { WorkschedulesComponent } from './views/customers/workschedules/workschedules.component';
import { EditcustomerComponent } from './views/customers/editcustomer/editcustomer.component';

const routes: Routes = [
  { path: '404', component: PageNotFoundComponentComponent },
  { path: 'home', component: HomeComponent },
  
  { path: 'customer', component: CustomersComponent },
  { path: 'customer/add', component: AddCustomerComponent },
  { path: 'customer/edit', component: UpdateCustomerComponent },
  { path: 'customer/locations', component: UpdateCustomerComponent },
  { path: 'customer/positions', component: UpdateCustomerComponent },
  { path: 'customer/update', component: UpdateCustomerComponent },
  { path: 'customer/users', component: UpdateCustomerComponent },
  { path: 'customer/workschedules', component: UpdateCustomerComponent },
  { path: 'customer/:id', component: UpdateCustomerComponent },
  { path: 'settings', component: CustomersComponent },
  { path: 'scheduler', component: CustomersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'person/addperson', component: AddpersonComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
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
  WorkCodesComponent,
  ContactpersonComponent,
  HeadquartersComponent,
  LanguagesComponent,
  GeneralComponent,
  InvoiceSettingsComponent,
  WorkschedulesComponent,
  PositionsComponent,
  UsersComponent,
  LocationsComponent,
  UpdateCustomerComponent,
  AddpersonComponent,
  AddCustomerComponent,
  LoginComponent,
  EditcustomerComponent
];
