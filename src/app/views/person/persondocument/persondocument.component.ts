import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { _Position, DpsPostion, LoginToken, DpsUser, Documents, DpsPerson } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { PersonService } from '../../../shared/person.service';


@Component({
  selector: 'app-persondocument',
  templateUrl: './persondocument.component.html',
  styleUrls: ['./../person.component.css']
})
export class PersonDocumentComponent implements OnInit {
  @Input() SocialSecurityId: string;
  public maindatas = [];
  public data: DpsPerson;
  constructor(private personService: PersonService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
  }

  onStatusChange(event, i) {
    console.log('Position index : ' + i + ', Enabled : ' + event);
  }

}
