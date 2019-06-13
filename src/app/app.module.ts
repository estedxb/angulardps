import { NgModule, EventEmitter } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
/* == 
 import { NgModule, EventEmitter, APP_INITIALIZER } from '@angular/core';
 import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
 == */
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
import { AppConfig } from './app.config';
import { DatePipe } from '@angular/common';
/* ==
import { AuthenticationGuard, MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { InsertAuthTokenInterceptor } from './insert-auth-token-interceptor';

let adalConfig: any; // will be initialized by APP_INITIALIZER
export function msAdalAngular6ConfigFactory() {
  return adalConfig; // will be invoked later when creating MsAdalAngular6Service
}
== */

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
  /*
  const promise = appConfig.load().then(() => {
    adalConfig = {
      tenant: AppConfig.settings.adalConfig.tenant,
      clientId: AppConfig.settings.adalConfig.clientId,
      redirectUri: window.location.origin,
      endpoints: AppConfig.settings.adalConfig.endpoints,
      navigateToLoginRequestUrl: false,
      cacheLocation: AppConfig.settings.adalConfig.cacheLocation
    };
  });
  return () => promise;
*/
}
@NgModule({
  declarations: [AppComponent, routingComponents, TestArraysComponent],
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
    /* ==
    MsAdalAngular6Module.forRoot({
      tenant: '<YOUR TENANT>',
      clientId: '<YOUR CLIENT / APP ID>',
      redirectUri: window.location.origin,
      endpoints: {
        'https://localhost/Api/': 'xxx-bae6-4760-b434-xxx'
      },
      navigateToLoginRequestUrl: false,
      cacheLocation: 'localStorage',
    }),
    == */
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
{
  provide: HTTP_INTERCEPTORS,
    useClass: InsertAuthTokenInterceptor
},
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true
    },
    AuthenticationGuard,

*/
