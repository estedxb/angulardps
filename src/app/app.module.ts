import { NgModule, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routingComponents, entringComponents, routingProviders } from './app-routing.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalModule, AlertModule, TimepickerModule } from 'ngx-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { MsalServiceLocal } from './shared/msal.service';
import { SpinnerComponent } from './componentcontrols/spinner/spinner.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { environment } from '../environments/environment';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MsalModule } from '@azure/msal-angular';
import { MsalInterceptor } from '@azure/msal-angular';
import { LogLevel } from 'msal';

export function loggerCallback(logLevel, message, piiEnabled) {
  console.log('client logging' + message);
}

export const protectedResourceMap: [string, string[]][] = [
  [
    'https://buildtodoservice.azurewebsites.net/api/todolist', ['api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user']
  ],
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]
];

@NgModule({
  declarations: [AppComponent, routingComponents, SpinnerComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule, NoopAnimationsModule, MatAutocompleteModule, MatTooltipModule,
    MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule, MatProgressButtonsModule, AppRoutingModule, AngularFontAwesomeModule,
    AutocompleteLibModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule, HttpClientModule,
    ModalModule.forRoot(), AlertModule.forRoot(), TimepickerModule.forRoot(),
    UiSwitchModule.forRoot({
      size: 'small', color: '#fff', switchOffColor: '#C7C7C7', switchColor: 'limegreen', defaultBoColor: '#000', defaultBgColor: '#fff'
    }), MsalModule.forRoot({
      clientID: environment.clientId,
      authority: environment.aadurl + '/tfp/' + environment.tenantid + '/',
      redirectUri: environment.webUrl + environment.B2CSuccess + environment.logInRedirectURL,
      validateAuthority: true,
      cacheLocation: 'localStorage',
      postLogoutRedirectUri: environment.webUrl + environment.B2CSuccess + environment.logOutRedirectURL,
      navigateToLoginRequestUrl: true,
      popUp: false,
      // consentScopes: ['user.read', 'api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user'],
      // unprotectedResources: ["https://angularjs.org/"],
      // protectedResourceMap: protectedResourceMap,
      logger: loggerCallback,
      // correlationId: '1234',
      level: LogLevel.Verbose,
      piiLoggingEnabled: true,

    })
  ],
  providers: [DatePipe, MsalServiceLocal, routingProviders],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [entringComponents]
})
export class AppModule { }
