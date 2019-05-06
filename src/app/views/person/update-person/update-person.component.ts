import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CustomersService } from 'src/app/shared/customers.service';
import { ContactpersonComponent } from '../../../contactperson/contactperson.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-person',
  templateUrl: './update-person.component.html',
  styleUrls: ['./../person.component.css']
})
export class UpdatePersonComponent implements OnInit {
  public CustomerName = 'SB Graphics bvba';
  public currentPage = 'editcustomer';
  public Id = '';

  public editPersonData: any;

  constructor(private customerService: CustomersService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

}
