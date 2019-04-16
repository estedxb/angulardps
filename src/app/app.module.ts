import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';
//import { MatAutocompleteModule,MatInputModule } from '@angular/material';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { CustomersComponent } from './customers/customers.component';
//import { HomeComponent } from './home/home.component';
//import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';
//import { CustomerselectionComponent } from './customerselection/customerselection.component';
//import { LegalComponent } from './componentcontrols/legal/legal.component';
//import { JointcommitteeComponent } from './componentcontrols/jointcommittee/jointcommittee.component';
import { MenuComponent } from './componentcontrols/menu/menu.component';
import { HeadersComponent } from './headers/headers.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CountriesComponent } from './componentcontrols/countries/countries.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    CountriesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    AutocompleteLibModule,
    //MatAutocompleteModule,
    //MatInputModule,
    //FormsModule,
    //ReactiveFormsModule,
    //NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent, MenuComponent, HeadersComponent]
})
export class AppModule { }
