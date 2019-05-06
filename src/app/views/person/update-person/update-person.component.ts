import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PersonService } from 'src/app/shared/person.service';
import { ContactpersonComponent } from '../../../contactperson/contactperson.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-person',
  templateUrl: './update-person.component.html',
  styleUrls: ['./../person.component.css']
})
export class UpdatePersonComponent implements OnInit {
  public PersonName = 'SB Graphics bvba';
  public currentPage = 'editperson';
  public SocialSecurityId = '';
  public Action = '';

  public editPersonData: any;

  constructor(private personService: PersonService, private route: ActivatedRoute) {
    const sub = this.route.params.subscribe((params: any) => {
      this.SocialSecurityId = params.id;
      this.currentPage = params.page;
    });

    console.log('SocialSecurityId :: ' + this.SocialSecurityId);
    console.log('CurrentPage :: ' + this.currentPage);
  }

  ngOnInit() {
  }

}
