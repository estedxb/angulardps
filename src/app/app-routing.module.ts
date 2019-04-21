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
import { ContactpersonComponent } from './contactperson/contactperson.component';
import { HeadquartersComponent } from './headquarters/headquarters.component';
import { LanguagesComponent } from './componentcontrols/languages/languages.component';
import { GeneralComponent } from './general/general.component';
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';
import { WorkscheduleComponent } from './views/Customers/workschedule/workschedule.component';
import { PositionComponent } from './views/Customers/position/position.component';
import { UsersComponent } from './views/Customers/users/users.component';
import { LocationsComponent } from './views/Customers/locations/locations.component';
import { UpdateCustomerComponent } from './views/Customers/update-customer/update-customer.component';
import { AddpersonComponent } from './views/person/addperson/addperson.component';
import { AddCustomerComponent } from './views/Customers/add-customer/add-customer.component';

const routes: Routes = [
  { path: '404', component: PageNotFoundComponentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'customer', component: CustomersComponent },
  { path: 'customer/add', component: AddCustomerComponent },
  { path: 'customer/:id', component: UpdateCustomerComponent },
  { path: 'customer/update', component: UpdateCustomerComponent },
  { path: 'settings', component: CustomersComponent },
  { path: 'scheduler', component: CustomersComponent },
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
  WorkscheduleComponent,
  PositionComponent,
  UsersComponent,
  LocationsComponent,
  UpdateCustomerComponent,
  AddpersonComponent,
  AddCustomerComponent
];
