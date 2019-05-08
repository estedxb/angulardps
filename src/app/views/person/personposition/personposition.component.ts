import { FormGroup,FormControl,Validators } from '@angular/forms';
import { Component, OnInit, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-personposition',
  templateUrl: './personposition.component.html',
  styleUrls: ['./../person.component.css']
})
export class PersonPositionComponent implements OnInit {
  @Input() SocialSecurityId: string;

  public PersonPositionForm: FormGroup;

  constructor() {
    
    this.PersonPositionForm = new FormGroup({
      grossHourlyWage: new FormControl('', [Validators.required]),
      extraRef: new FormControl('', [Validators.required]),
    });

   }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
  }

}
