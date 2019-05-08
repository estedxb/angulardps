import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-personposition',
  templateUrl: './personposition.component.html',
  styleUrls: ['./../person.component.css']
})
export class PersonPositionComponent implements OnInit {

  public PersonPositionForm: FormGroup;

  constructor() {
    
    this.PersonPositionForm = new FormGroup({
      grossHourlyWage: new FormControl('', [Validators.required]),
      extraRef: new FormControl('', [Validators.required]),
    });

   }

  ngOnInit() {
  }

}
