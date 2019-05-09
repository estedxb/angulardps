import { NgModule, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routingComponents, entringComponents } from './app-routing.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { UiSwitchModule } from 'ngx-ui-switch';
import { AlertsModule } from 'angular-alert-module';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalModule, AlertModule, TimepickerModule } from 'ngx-bootstrap';
import { CancelcontractComponent } from './componentcontrols/cancelcontract/cancelcontract.component';

@NgModule({
  declarations: [AppComponent, routingComponents, CancelcontractComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    AutocompleteLibModule,
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
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [entringComponents]
})
export class AppModule { }

