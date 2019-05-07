import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  public maindatas = [];
  public data: DpsPerson;
  constructor(private personService: PersonService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  onStatusChange(event, i) {
    console.log('Position index : ' + i + ', Enabled : ' + event);
  }

}
