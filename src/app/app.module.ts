import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './componentcontrols/menu/menu.component';
import { HeadersComponent } from './views/headers/headers.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ContactpersonComponent } from './contactperson/contactperson.component';
import { HeadquartersComponent } from './headquarters/headquarters.component';
// import { UiSwitchModule } from 'ngx-toggle-switch';
@NgModule({
  declarations: [AppComponent, routingComponents, ContactpersonComponent, HeadquartersComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    AutocompleteLibModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: '#fff',
      switchOffColor : 'red',
      switchColor: 'limegreen',
      defaultBoColor : '#000',
      defaultBgColor : '#fff'
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent, MenuComponent, HeadersComponent]
})
export class AppModule { }

// import { MatAutocompleteModule,MatInputModule } from '@angular/material';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { CustomersComponent } from './customers/customers.component';
// import { HomeComponent } from './home/home.component';
// import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';
// import { CustomerselectionComponent } from './customerselection/customerselection.component';
// import { LegalComponent } from './componentcontrols/legal/legal.component';
// import { JointcommitteeComponent } from './componentcontrols/jointcommittee/jointcommittee.component';
// import { CountriesComponent } from './componentcontrols/countries/countries.component';
// import { StatuteComponent } from './componentcontrols/statute/statute.component';
// import { WorkCodesComponent } from './componentcontrols/workcodes/workcodes.component';
// import { UiSwitchModule } from 'ngx-toggle-switch';

// MatAutocompleteModule, MatInputModule, FormsModule, ReactiveFormsModule, NgbModule ,
/*

  */