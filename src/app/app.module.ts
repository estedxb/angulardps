import { NgModule, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { environment } from '../environments/environment';
import { ErrorComponent } from './error.component';
import { HttpClientModule } from '@angular/common/http';

import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';
import { VehicleTypesComponent } from './componentcontrols/vehicle-types/vehicle-types.component';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#e37719',
  bgsOpacity: 0.5,
  bgsPosition: 'center-center',
  bgsSize: 60,
  bgsType: 'ball-spin-clockwise-fade-rotating',
  blur: 5,
  fgsColor: 'white',
  fgsPosition: 'center-center',
  fgsSize: 60,
  fgsType: 'rectangle-bounce',
  gap: 24,
  logoPosition: 'center-center',
  logoSize: 200,
  logoUrl: '../assets/svg/dpslogo.svg',
  masterLoaderId: 'master',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(227,119,25,0.5)',
  pbColor: 'red',
  pbDirection: 'ltr',
  pbThickness: 3,
  hasProgressBar: true,
  text: 'Bezig met laden ...',
  textColor: '#FFFFFF',
  textPosition: 'center-center'
  // ,
  // delay: 0,
  // maxTime: -1,
  // minTime: 500  
};

export function loggerCallback(logLevel, message, piiEnabled) {
  console.log('client logging' + message);
}


@NgModule({
  declarations: [AppComponent, routingComponents, ErrorComponent, VehicleTypesComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule, NoopAnimationsModule, MatAutocompleteModule, MatTooltipModule, MatInputModule,
    MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule, MatProgressButtonsModule, AppRoutingModule, AutocompleteLibModule,
    FormsModule, ReactiveFormsModule, HttpClientModule, AngularFontAwesomeModule, ModalModule.forRoot(),
    AlertModule.forRoot(), TimepickerModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    UiSwitchModule.forRoot({ size: 'small', color: '#fff', switchOffColor: '#C7C7C7', switchColor: 'limegreen', defaultBoColor: '#000', defaultBgColor: '#fff' })
  ],
  providers: [DatePipe, routingProviders],
  bootstrap: [AppComponent],
  exports: [],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [entringComponents]
})
export class AppModule { }
/*

*/