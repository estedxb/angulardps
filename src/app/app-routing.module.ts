import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerSelectionComponent } from './componentcontrols/customerselection/customerselection.component';
import { MenuComponent } from './componentcontrols/menu/menu.component';
import { HeadersComponent } from './componentcontrols/headers/headers.component';
import { LegalComponent } from './componentcontrols/legal/legal.component';
import { JointcommitteeComponent } from './componentcontrols/jointcommittee/jointcommittee.component';
import { CountriesComponent } from './componentcontrols/countries/countries.component';
import { StatuteComponent } from './componentcontrols/statute/statute.component';
import { WorkCodesComponent } from './componentcontrols/workcodes/workcodes.component';
import { ContactPersonComponent } from './contactperson/contactperson.component';
import { LanguagesComponent } from './componentcontrols/languages/languages.component';

import { HeadQuartersComponent } from './headquarters/headquarters.component';
import { GeneralComponent } from './general/general.component';
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';
import { HomeComponent } from './views/home/home.component';
import { PageNotFoundComponentComponent } from './views/page-not-found-component/page-not-found-component.component';
import { AddPersonComponent } from './views/person/addperson/addperson.component';
import { AddCustomerComponent } from './views/customers/add-customer/add-customer.component';
import { UpdateCustomerComponent } from './views/customers/update-customer/update-customer.component';
import { PositionsComponent } from './views/customers/positions/positions.component';
import { UsersComponent } from './views/customers/users/users.component';
import { LocationsComponent } from './views/customers/locations/locations.component';
import { WorkSchedulesComponent } from './views/customers/workschedules/workschedules.component';
import { EditCustomerComponent } from './views/customers/editcustomer/editcustomer.component';
import { SettingsComponent } from './views/settings/settings.component';
import { CreateuserComponent } from './views/customers/users/createuser/createuser.component';
import { CreatelocationComponent } from './views/customers/locations/createlocation/createlocation.component';
import { DPSSystemMessageComponent } from './componentcontrols/dpssystem-message/dpssystem-message.component';
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { SchedulerComponent } from './views/scheduler/scheduler.component';
import { FileUploadComponent } from './componentcontrols/fileupload/fileupload.component';
import { CreateWorkScheduleComponent } from './views/customers/workschedules/createworkschedule/createworkschedule.component';
import { CreatepositionComponent } from './views/customers/positions/createposition/createposition.component';
import { CreateWorkTimeComponent } from './componentcontrols/createworktime/createworktime.component';
import { CreateContractComponent } from './componentcontrols/createcontract/createcontract.component';
import { CalendarComponent } from './componentcontrols/calendar/calendar.component';

import { EnableFilterPipe } from './pipes/enable-filter.pipe';
import { ArchiveFilterPipe } from './pipes/archive-filter.pipe';
import { UpdatePersonComponent } from './views/person/update-person/update-person.component';
import { EditPersonComponent } from './views/person/editperson/editperson.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import { PersonPositionComponent } from './views/person/personposition/personposition.component';
import { PersonDocumentComponent } from './views/person/persondocument/persondocument.component';
import { DashboardActionComponent } from './views/dashboard/dashboardaction/dashboardaction.component';
import { DashboardPersonComponent } from './views/dashboard/dashboard-person/dashboard-person.component';
import { CancelContractComponent } from './componentcontrols/cancelcontract/cancelcontract.component';
import { BulkContractComponent } from './views/bulk-contract/bulk-contract.component';
import { WeekPipe } from './pipes/week.pipe';
import { TimeSpliterPipe } from './pipes/time-spliter.pipe';
import { TestArraysComponent } from './test-arrays/test-arrays.component';
import { NumPipe } from './pipes/num.pipe';

const routes: Routes = [
  { path: '404', component: PageNotFoundComponentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:page/:id', component: DashboardComponent },
  { path: 'customer', component: AddCustomerComponent },
  { path: 'customer/addcustomer', component: AddCustomerComponent },
  { path: 'customer/add', component: AddCustomerComponent },
  { path: 'customer/:id', component: UpdateCustomerComponent },
  { path: 'customer/:id/:page', component: UpdateCustomerComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'scheduler', component: SchedulerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'person/addperson', component: AddPersonComponent },
  { path: 'person/add', component: AddPersonComponent },
  { path: 'person/:id', component: UpdatePersonComponent },
  { path: 'TestArrays', component: TestArraysComponent },
  { path: 'bulkcontract', component: BulkContractComponent },
  { path: 'person/:id/:page', component: UpdatePersonComponent },
  // { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: 'auth-callback', component: AuthCallbackComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];
// , canActivate: [AuthGuard]

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  MenuComponent, HeadersComponent, LoginComponent,
  HomeComponent, DashboardComponent, PageNotFoundComponentComponent,
  SettingsComponent,
  CustomerSelectionComponent,
  LegalComponent,
  JointcommitteeComponent,
  CountriesComponent, StatuteComponent, LanguagesComponent,
  WorkCodesComponent,
  ContactPersonComponent,
  HeadQuartersComponent, GeneralComponent, InvoiceSettingsComponent,
  AddCustomerComponent, EditCustomerComponent, UpdateCustomerComponent,
  AddPersonComponent, EditPersonComponent, UpdatePersonComponent,
  WorkSchedulesComponent, PositionsComponent, UsersComponent, LocationsComponent,
  PersonPositionComponent, PersonDocumentComponent,
  SchedulerComponent,
  CreateuserComponent,
  CreatelocationComponent,
  DPSSystemMessageComponent,
  FileUploadComponent,
  CreateWorkScheduleComponent,
  CreatepositionComponent,
  EnableFilterPipe,
  ArchiveFilterPipe,
  CreateWorkTimeComponent,
  CalendarComponent,
  CreateContractComponent,
  DashboardActionComponent,
  DashboardPersonComponent,
  CancelContractComponent,
  BulkContractComponent,
  WeekPipe,
  TimeSpliterPipe,
  NumPipe
];
export const entringComponents = [
  DPSSystemMessageComponent,
  CreateuserComponent,
  CreatelocationComponent,
  CreateWorkScheduleComponent,
  CreatepositionComponent,
  CreateWorkTimeComponent,
  CancelContractComponent,
  CreateContractComponent
];
