import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { UiSwitchModule } from 'ngx-ui-switch';
<<<<<<< HEAD
import { ContactpersonComponent } from './contactperson/contactperson.component';
import { HeadquartersComponent } from './headquarters/headquarters.component';
import { LanguagesComponent } from './componentcontrols/languages/languages.component';
import { GeneralComponent } from './general/general.component';
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';
import { CreateuserComponent } from './componentcontrols/createuser/createuser.component';
import { CreatelocationComponent } from './componentcontrols/createlocation/createlocation.component';
// import { UiSwitchModule } from 'ngx-toggle-switch';
@NgModule({
  declarations: [AppComponent, routingComponents, ContactpersonComponent, HeadquartersComponent, LanguagesComponent, GeneralComponent, InvoiceSettingsComponent, CreateuserComponent, CreatelocationComponent],
=======

@NgModule({
  declarations: [AppComponent, routingComponents],
>>>>>>> 0cd174c3e6b68d4d24838ad1bc6126515f38b652
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    AutocompleteLibModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: '#fff',
      switchOffColor: 'red',
      switchColor: 'limegreen',
      defaultBoColor: '#000',
      defaultBgColor: '#fff'
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

/*
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { MatAutocompleteModule,MatInputModule } from '@angular/material';
MatAutocompleteModule, MatInputModule, FormsModule, ReactiveFormsModule,
NgbModule ,
*/
