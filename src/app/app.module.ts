import { NgModule, EventEmitter } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routingComponents, entringComponents } from './app-routing.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { UiSwitchModule } from 'ngx-ui-switch';
import { AlertsModule } from 'angular-alert-module';
import { MatAutocompleteModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalModule, AlertModule, TimepickerModule } from 'ngx-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TestArraysComponent } from './test-arrays/test-arrays.component';
import { DatePipe } from '@angular/common';
import { environment } from '../environments/environment';
import { CurrencyComponent } from './componentcontrols/currency/currency.component';

@NgModule({
  declarations: [AppComponent, routingComponents, TestArraysComponent, CurrencyComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    AutocompleteLibModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TimepickerModule.forRoot(),
    UiSwitchModule.forRoot({
      size: 'small',
      color: '#fff',
      switchOffColor: '#C7C7C7',
      switchColor: 'limegreen',
      defaultBoColor: '#000',
      defaultBgColor: '#fff'
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AlertsModule.forRoot()
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [entringComponents]
})
export class AppModule { }

/*
import { MsAdalAngular6Module, AuthenticationGuard } from 'microsoft-adal-angular6';

==============


    MsAdalAngular6Module.forRoot({
      tenant: environment.tenantid,
      clientId: environment.clientId,
      redirectUri: window.location.origin,
      endpoints: {
        'https://localhost:4200/Api/': 'xxx-bae6-4760-b434-xxx'
      },
      navigateToLoginRequestUrl: false,
      cacheLocation: 'localStorage',
    }),


    AuthenticationGuard,

    ========
*/
