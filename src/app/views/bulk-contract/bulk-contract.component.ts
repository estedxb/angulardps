import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-bulk-contract',
  templateUrl: './bulk-contract.component.html',
  styleUrls: ['./bulk-contract.component.css']
})
export class BulkContractComponent implements OnInit {

  public showFormIndex = 1;
  public startDate:string;
  public endDate:string;

  public blkForm:FormGroup;
  public loadSwitchperson:boolean;

  constructor() { }

  ngOnInit() {

    this.blkForm = new FormGroup({
      functie: new FormControl('')
    });

    
  }

  receiveStartDate($event){

  }

  receiveEndDate($event){

  }

  onChangeI($event){

  }

}
