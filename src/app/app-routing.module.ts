import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
// import { MsalModule, MsalGuard, MsalInterceptor, MsalService } from '@azure/msal-angular';
import { LogLevel } from 'msal';

import { CustomerSelectionComponent } from './componentcontrols/customerselection/customerselection.component';
import { MenuComponent } from './componentcontrols/menu/menu.component';
import { HeadersComponent } from './componentcontrols/headers/headers.component';
import { LegalComponent } from './componentcontrols/legal/legal.component';
import { JointcommitteeComponent } from './componentcontrols/jointcommittee/jointcommittee.component';
import { CountriesComponent } from './componentcontrols/countries/countries.component';
import { StatuteComponent } from './componentcontrols/statute/statute.component';
import { WorkCodesComponent } from './componentcontrols/workcodes/workcodes.component';
import { LanguagesComponent } from './componentcontrols/languages/languages.component';
import { CancelContractComponent } from './componentcontrols/cancelcontract/cancelcontract.component';
import { FileUploadComponent } from './componentcontrols/fileupload/fileupload.component';
import { CreateWorkTimeComponent } from './componentcontrols/createworktime/createworktime.component';
import { CreateContractComponent } from './componentcontrols/createcontract/createcontract.component';
import { DPSSystemMessageComponent } from './componentcontrols/dpssystem-message/dpssystem-message.component';
import { CalendarComponent } from './componentcontrols/calendar/calendar.component';
import { CalendarDOBComponent } from './componentcontrols/calendardob/calendardob.component';
import { ZichmetComponent } from './componentcontrols/zichmet/zichmet.component';
import { CurrencyComponent } from './componentcontrols/currency/currency.component';

import { ContactPersonComponent } from './contactperson/contactperson.component';
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
import { LoginComponent } from './views/login/login.component';
import { SchedulerComponent } from './views/scheduler/scheduler.component';
import { CreateWorkScheduleComponent } from './views/customers/workschedules/createworkschedule/createworkschedule.component';
import { CreatepositionComponent } from './views/customers/positions/createposition/createposition.component';
import { UpdatePersonComponent } from './views/person/update-person/update-person.component';
import { EditPersonComponent } from './views/person/editperson/editperson.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PersonPositionComponent } from './views/person/personposition/personposition.component';
import { PersonDocumentComponent } from './views/person/persondocument/persondocument.component';
import { DashboardActionComponent } from './views/dashboard/dashboardaction/dashboardaction.component';
import { DashboardPersonComponent } from './views/dashboard/dashboard-person/dashboard-person.component';
import { BulkContractComponent } from './views/bulk-contract/bulk-contract.component';
import { LogoutComponent } from './views/logout/logout.component';

import { ValidateLoginComponent } from './validate-login/validate-login.component';
import { B2cloginComponent } from './b2clogin/b2clogin.component';

import { EnableFilterPipe } from './pipes/enable-filter.pipe';
import { ArchiveFilterPipe } from './pipes/archive-filter.pipe';
import { WeekPipe } from './pipes/week.pipe';
import { TimeSpliterPipe } from './pipes/time-spliter.pipe';
import { NumPipe } from './pipes/num.pipe';
import { environment } from '../environments/environment';
// Logger callback for MSAL
export function loggerCallback(logLevel, message, piiEnabled) {
  console.log(message);
}

const routes: Routes = [
  { path: '404', component: PageNotFoundComponentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'index', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:page', component: DashboardComponent },
  { path: 'dashboard/:page/:id', component: DashboardComponent },
  { path: 'customer', component: AddCustomerComponent },
  { path: 'customer/addcustomer', component: AddCustomerComponent },
  { path: 'customer/add', component: AddCustomerComponent },
  { path: 'customer/:id', component: UpdateCustomerComponent },
  { path: 'customer/:id/:page', component: UpdateCustomerComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'scheduler', component: SchedulerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'person/addperson', component: AddPersonComponent },
  { path: 'person/add', component: AddPersonComponent },
  { path: 'person/:id', component: UpdatePersonComponent },
  { path: 'bulkcontract', component: BulkContractComponent },
  { path: 'person/:id/:page', component: UpdatePersonComponent },
  { path: 'b2clogin', component: B2cloginComponent },
  { path: 'validatelogin', component: ValidateLoginComponent },
  { path: '', redirectTo: '/' + environment.B2C + environment.logInRedirectURL, pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  MenuComponent, HeadersComponent, LoginComponent, DashboardComponent, CustomerSelectionComponent,
  PageNotFoundComponentComponent, SettingsComponent, HomeComponent, ZichmetComponent, LogoutComponent,
  LegalComponent, JointcommitteeComponent, WorkCodesComponent, UsersComponent, ValidateLoginComponent,
  CountriesComponent, StatuteComponent, LanguagesComponent, InvoiceSettingsComponent, CurrencyComponent,
  HeadQuartersComponent, GeneralComponent, AddCustomerComponent, EditPersonComponent, ContactPersonComponent,
  EditCustomerComponent, UpdateCustomerComponent, AddPersonComponent, SchedulerComponent, CalendarComponent,
  UpdatePersonComponent, WorkSchedulesComponent, PositionsComponent, CancelContractComponent, FileUploadComponent,
  LocationsComponent, PersonPositionComponent, PersonDocumentComponent, BulkContractComponent, CreateuserComponent,
  CreatelocationComponent, DPSSystemMessageComponent, CreateWorkScheduleComponent, CreatepositionComponent,
  CreateWorkTimeComponent, CreateContractComponent, DashboardActionComponent, DashboardPersonComponent,
  EnableFilterPipe, ArchiveFilterPipe, WeekPipe, TimeSpliterPipe, NumPipe, CalendarDOBComponent, B2cloginComponent
];

export const entringComponents = [
  DPSSystemMessageComponent, CreateuserComponent, CreatelocationComponent, CreateWorkScheduleComponent,
  CreatepositionComponent, CreateWorkTimeComponent, CancelContractComponent, CreateContractComponent
];

export const routingProviders = [];
