import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [
      {
        vatNumber: 'BE23244',
        customerName: 'Customer Name 1',
        officialName: 'Official Name 1',
        checkCheck: true,
        creditLimt: 10000,
        legalForm: 'Comm. V',
        street: 'Sheikh Zayed ROad',
        streetNo: 10,
        bus: 'B10',
        place: 'Deira, Dubai',
        postal: 1245,
        country: 'UAE',
        telephone: '+971 50 5642721',
        generalEmail: 'development.2@jobfixers.be',
        billingEmail: 'development.2@jobfixers.be',
        contractEmail: 'development.2@jobfixers.be'
      },
      {
        vatNumber: 'BE232442',
        customerName: 'Customer Name 2',
        officialName: 'Official Name 3',
        checkCheck: true,
        creditLimt: 5000000,
        legalForm: 'Xyz',
        street: '29st Street',
        streetNo: 12,
        bus: 'F10',
        place: 'Deira, Dubai',
        postal: 1245,
        country: 'UAE',
        telephone: '+971501234567',
        generalEmail: 'development.3@jobfixers.be',
        billingEmail: 'development.3@jobfixers.be',
        contractEmail: 'development.3@jobfixers.be'
      },
      {
        vatNumber: 'BE01234567',
        customerName: 'Test Company 3',
        officialName: 'Test 3',
        checkCheck: true,
        creditLimt: 6000000.0,
        legalForm: 'AAB',
        street: 'XYZ Street',
        streetNo: 52,
        bus: 'K10',
        place: 'Bur Dubai, Dubai,',
        postal: 1278,
        country: 'UAE',
        telephone: '+971507654321',
        generalEmail: 'development.4@jobfixers.be',
        billingEmail: 'development.4@jobfixers.be',
        contractEmail: 'development.4@jobfixers.be'
      }
  ];

  constructor() { }

  ngOnInit() {
  }

}
