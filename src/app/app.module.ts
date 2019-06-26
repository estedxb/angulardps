import { NgModule, EventEmitter } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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

@NgModule({
  declarations: [AppComponent, routingComponents, SpinnerComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule, NoopAnimationsModule, MatAutocompleteModule, MatTooltipModule,
    MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule, MatProgressButtonsModule, AppRoutingModule, AngularFontAwesomeModule,
    AutocompleteLibModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule, HttpClientModule,
    ModalModule.forRoot(), AlertModule.forRoot(), TimepickerModule.forRoot(),
    UiSwitchModule.forRoot({
      size: 'small', color: '#fff', switchOffColor: '#C7C7C7', switchColor: 'limegreen', defaultBoColor: '#000', defaultBgColor: '#fff'
    })
  ],
  providers: [DatePipe, MsalServiceLocal, routingProviders],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [entringComponents]
})
export class AppModule { }
