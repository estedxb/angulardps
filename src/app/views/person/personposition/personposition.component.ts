import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { PersonService } from '../../../shared/person.service';
import { PositionsService } from '../../../shared/positions.service';
import { StatuteService } from '../../../shared/statute.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { CreatepositionComponent } from '../../customers/positions/createposition/createposition.component';

import {
  DpsPerson, Person, SocialSecurityNumber, Gender, BankAccount, Renumeration, MedicalAttestation,
  Language, DpsPostion, _Position,
  ConstructionProfile, StudentAtWorkProfile, Documents, DriverProfilesItem, Address,
  EmailAddress, PhoneNumber, Statute, VcaCertification, LoginToken
} from '../../../shared/models';
import { DataService } from 'src/app/shared/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from '../../../shared/logging.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-personposition',
  templateUrl: './personposition.component.html',
  styleUrls: ['./../person.component.css']
})

export class PersonPositionComponent implements OnInit {
  @Input() public SocialSecurityId: string;
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));

  public PersonPositionForm: FormGroup;
  public dataDropDownStatute: Array<string>;
  public maindatas = [];
  public datas: DpsPostion;
  public dataDropDownFunctie: string[];
  public dataDropDownFunctieIds: number[];
  public dpsPosition;
  public SelectedIndexFunctie = 0;
  public _position;
  public workstationDocument;

  public DpsPersonObject: DpsPerson;
  public PersonObject: Person;
  public SocialSecurityNumberObject: SocialSecurityNumber;
  public GenderObject: Gender;
  public BankAccountObject: BankAccount;
  public RenumerationObject: Renumeration;
  public MedicalAttestationObject: MedicalAttestation;
  public ConstructionProfileObject: ConstructionProfile;
  public studentsAtWorkProfileObject: StudentAtWorkProfile;
  public driverProfiles: DriverProfilesItem[];
  public driverProfilesObject: DriverProfilesItem;
  public otherDocumentsObject: Document;
  public attestation: Document;
  public constructionCardObject: Document;
  public constructionCardArray: Document[];
  public dataDropDown: string[];
  public dropDownMonth: string[];
  public dropDownYear: Array<string>;
  public dataDropDownGender: string[];
  public dialogConfig = new MatDialogConfig();

  public dateofBirth;
  public selectedGenderIndex;
  public selectedIndexFunctie = 0;
  public kmtoggle;
  public nettoggle;

  public showFormIndex = 1;

  public id = 'dd_days';
  public currentlanguage = 'nl';
  public errorMsg;

  public dayString;
  public monthString;
  public yearString;
  public positionChosen: string;
  public positionId: number;
  public statuteChosen: string;
  public statutes = [];
  public countStatutes: number;
  public lastAddedPosition: string;
  public lastAddedPositionId:string;

  public selectedIndexStatute: any = 0;
  public message: any;

  private _selectedValue: any; private _selectedIndex: any = 0; private _value: any;

  set selectedValue(value: any) { this._selectedValue = value; }
  get selectedValue(): any { return this._selectedValue; }
  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.dataDropDownFunctie[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndex; }
  set value(value: any) { this._value = value; }
  get value(): any { return this._value; }
  resetToInitValue() { this.value = this.selectedValue; }
  SetInitialValue() { if (this.selectedValue === undefined) { this.selectedValue = this.dataDropDownFunctie[this.selectedIndex]; } }


  constructor(
    private personsService: PersonService, private data: DataService,
    private logger: LoggingService, private positionsService: PositionsService,
    private fb: FormBuilder, private dialog: MatDialog,
    // private spinner: NgxUiLoaderService,
    private snackBar: MatSnackBar, private statuteService: StatuteService) {

    this.positionsService.getPositionsByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(positions => {
      this.maindatas = positions;
      this.FilterTheArchive();
      this.fillDataDropDown(this.maindatas);
      this.logger.log('Positions Form Data : ', this.maindatas);
      //this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));

    //SetInitialValue();
    this.logger.log("social security id=" + this.SocialSecurityId);
  }

  fillDataDropDown(maindatas) {

    this.dataDropDownFunctie = [];
    this.dataDropDownFunctieIds = [];

    for (let i = 0; i < maindatas.length; i++) {
      let positionObject = maindatas[i].position.name;
      if (maindatas[i].position.name !== "") {
        this.dataDropDownFunctie.push(positionObject);
        this.dataDropDownFunctieIds.push(maindatas[i].position.id);
      }
    }

    this.selectedIndexFunctie = this.dataDropDownFunctie.length - 1;

    this.getPersonbySSIDVatNumber();
  }

  fillDataDropDownOnAdd(maindatas) {

    this.dataDropDownFunctie = [];
    this.dataDropDownFunctieIds = [];

    for (let i = 0; i < maindatas.length; i++) {
      let positionObject = maindatas[i].position.name;
      if (maindatas[i].position.name !== "") {
        this.dataDropDownFunctie.push(positionObject);
        this.dataDropDownFunctieIds.push(maindatas[i].position.id);
      }
    }

    this.selectedIndexFunctie = this.getIndexOfPositionDropDownFunctie(this.lastAddedPosition);

    this.logger.log("selected index");
    this.logger.log(this.selectedIndexFunctie);    

    if(this.lastAddedPosition === "0" || this.lastAddedPosition === "-1"  || this.lastAddedPosition === null) 
    {
      this.ShowMessage("position index not found",'');
      return;
    }
    else
    {
      this.DpsPersonObject.customerPostionId = ""+this.lastAddedPositionId;
      this.changeMessage();  
    }

    //this.getPersonbySSIDVatNumber();
  }

  

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = this.dpsPosition;
      dialogConfig.ariaLabel = 'Arial Label Positions Dialog';

      const dialogRef = this.dialog.open(CreatepositionComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        this.logger.log('The dialog was closed');
        this.datas = result;

        //this.maindatas = result;
        this.logger.log('this.data ::', this.datas);

        if (this.datas !== null && this.datas !== undefined) {
          if (this.SelectedIndexFunctie > -1) {
            //this.maindatas[this.SelectedIndexFunctie] = this.dataDropDownFunctie;
            this.maindatas.push(this.datas);
            this.FilterTheArchive();
            this.fillDataDropDownOnAdd(this.maindatas);
            this.ShowMessage('Positions "' + this.datas.position.name + '" is updated successfully.', '');
          } else {
            this.logger.log('this.data.id :: ', this.datas.id);
            if (parseInt('0' + this.datas.id, 0) > 0) {
              this.maindatas.push(this.datas);
              this.logger.log(' new this.maindatas :: ', this.maindatas);
              this.FilterTheArchive();
              this.ShowMessage('Positions "' + this.datas.position.name + '" is added successfully.', '');
            }
          }
        }
      });
    } catch (e) { }
  }

  FilterTheArchive() {

    this.maindatas = this.maindatas.filter(d => d.isArchived === false);
    let sortedmaindatas = [];

    let positionArrays = [];
    let tempArray = this.maindatas;

    for(let i=0;i<this.maindatas.length;i++)
        positionArrays.push((this.maindatas[i].position.name.toLowerCase()));

    if(this.maindatas !== null && this.maindatas !== undefined)
    {
      this.lastAddedPosition = this.maindatas[this.maindatas.length-1].position.name;
      this.lastAddedPositionId = this.maindatas[this.maindatas.length-1].id;  
    }

    positionArrays.sort();
 
    for(let i=0;i<positionArrays.length;i++)
    {
      let found:boolean = false;

      for(let j=0;j<this.maindatas.length && !found;j++)
        if(positionArrays[i] === this.maindatas[j].position.name.toLowerCase())
        {
          sortedmaindatas.push(this.maindatas[j]);
          found = true;
        }
    }

    this.maindatas = [];

    for(let i=0;i<sortedmaindatas.length;i++)
      this.maindatas.push(sortedmaindatas[i]);
      
  }

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      this.logger.log('Snackbar Action :: ' + Action);
    });
  }

  setDummyStatute(data) {
    this.dataDropDownStatute = [];

    data.forEach(element => {
      this.dataDropDownStatute.push(element.name);
    });
  }

  changeMessage() {

    this.logger.log("person data changed");
    this.logger.log(this.DpsPersonObject);

    if (this.DpsPersonObject !== null) {
      let newmessage: any = {
        "page": "position",
        "data": this.DpsPersonObject
      };
      this.data.changeMessage(newmessage);
    }
  }

  ngOnInit() {

    this.onPageInit();

    this.PersonPositionForm = new FormGroup({
      functie: new FormControl('', [Validators.required]),
      statute: new FormControl('', [Validators.required]),
      grossHourlyWage: new FormControl('', [Validators.required]),
      netExpenseAllowance: new FormControl('', [Validators.required]),
      extraRef: new FormControl('', [Validators.required]),
      countryOnetExpenseAllowancefBirth: new FormControl('', [Validators.required]),
      extra: new FormControl('', [Validators.required])
    });

    this.positionChosen = "";
    this.positionId = -1;

    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;
      this.setDummyStatute(this.statutes);
      this.logger.log('data from getStatutues(): ');
      this.logger.log(data);
      this.countStatutes = data.length;
    }, error => this.errorMsg = error);

    this.nettoggle = true;
    this.kmtoggle = true;

    this.data.currentMessage.subscribe(message => this.message = message);
    this.updatePosition();

  }

  onClickAdd() {

    this.dpsPosition = new DpsPostion();
    this._position = new _Position();
    this.workstationDocument = new Documents();

    this.workstationDocument.name = '';
    this.workstationDocument.location = '';

    this._position.costCenter = '';
    this._position.isStudentAllowed = false;
    this._position.name = '';
    this._position.taskDescription = '';
    this._position.workstationDocument = this.workstationDocument;

    this.dpsPosition.customerVatNumber = this.dpsLoginToken.customerVatNumber;
    this.dpsPosition.id = 0;
    this.dpsPosition.isArchived = false;
    this.dpsPosition.isEnabled = true;

    this.dpsPosition.position = this._position;
    this.openDialog();
  }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  onPageInit() {
  }

  switchNetExpense($event) {    
    this.DpsPersonObject.renumeration.costReimbursment = $event;

    if ($event === true) {
      this.PersonPositionForm.controls.netExpenseAllowance.enable();
    }
    else {
      this.PersonPositionForm.controls.netExpenseAllowance.disable();
    }

    this.changeMessage();
  }

  getPersonbySSIDVatNumber() {

    const customerVatNumber = this.dpsLoginToken.customerVatNumber;

    this.personsService.getPersonBySSIDVatnumber(this.SocialSecurityId, customerVatNumber).subscribe(res => {
      this.logger.log("load person called Y ", res);
      //this.loadPersonData(res);
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.logger.log('Error occured=' + err.error.message);
        } else {
          this.logger.log('response code=' + err.status);
          this.logger.log('response body=' + err.error);
        }
      }
    );
  }

  findIndex(position) {

    this.logger.log("position received="+position);

    for (let i = 0; i < this.maindatas.length; i++) {
      this.logger.log(typeof(this.maindatas[i].id));
      if (position === this.maindatas[i].id)
        this.selectedIndexFunctie = i;
        // this._selectedIndex = i;
    }
  }

  getIndexOfPositionDropDownFunctie(position:string) {

    this.logger.log("position ="+position);

    let index = -1;
    for(let i=0;i<this.dataDropDownFunctie.length;i++)
    {
      if(position.toLowerCase() === this.dataDropDownFunctie[i].toLowerCase())
        index = i;
    }

    return index;

  }

  getIdOfPosition(position:string) {

    for (let i = 0; i < this.maindatas.length; i++) {
      this.logger.log(typeof(this.maindatas[i].id));
      if (position === this.maindatas[i].position.name.toString())
      {
        return this.maindatas[i].id;
      }
    }

    return "";
  }

  loadPersonData(response) 
  {

    const data = response;
    let counter: number = 0;

    this.DpsPersonObject = new DpsPerson();
    this.DpsPersonObject = data;

    this.logger.log("response");
    this.logger.log(response);

    if (data.customerPostionId !== "" && data.customerPostionId !== null && data.customerPostionId !== undefined) 
        this.findIndex(parseInt(data.customerPostionId, 10));
    else {

      this.selectedIndexFunctie = this.getIndexOfPositionDropDownFunctie(this.lastAddedPosition);
      this.DpsPersonObject.customerPostionId = "" + (this.selectedIndexFunctie);

    }

    if (data.statute !== null && data.statute !== undefined && data.statute !== "") 
    {
      counter = 0;
      this.statutes.forEach((element) => {

        if(element.name === data.statute.name)
        {
          this.selectedIndexStatute = counter;
          this.DpsPersonObject.statute = new Statute();
          this.DpsPersonObject.statute.name = data.statute.name;
          this.DpsPersonObject.statute.type = data.statute.type;
          this.DpsPersonObject.statute.brightStaffingID = data.statute.BrightStaffingID;    
        }
        counter++;
      });      

      this.changeMessage();

    }
    else {

      this.selectedIndexStatute = 0;

      this.DpsPersonObject.statute = new Statute();
      this.DpsPersonObject.statute.name = this.statutes[this.selectedIndexStatute].name;
      this.DpsPersonObject.statute.type = this.statutes[this.selectedIndexStatute].type;
      this.DpsPersonObject.statute.brightStaffingID = this.statutes[this.selectedIndexStatute].BrightStaffingID;

      this.changeMessage();

    }

    //hourlyWage
    //netCostReimbursment
    //transportationAllowance
    //costReimbursment


    if(data.renumeration !== null && data.renumeration !== undefined)
    {
      this.DpsPersonObject.renumeration = new Renumeration();
      this.DpsPersonObject.renumeration.hourlyWage = data.renumeration.hourlyWage;
      this.DpsPersonObject.renumeration.netCostReimbursment = data.renumeration.netCostReimbursment;

      this.kmtoggle = data.renumeration.transportationAllowance;
      this.nettoggle = data.renumeration.costReimbursment;

      this.DpsPersonObject.renumeration.costReimbursment = this.nettoggle;
      this.DpsPersonObject.renumeration.transportationAllowance = this.kmtoggle;
  
      this.PersonPositionForm.controls.grossHourlyWage.setValue(data.renumeration.hourlyWage);
      this.PersonPositionForm.controls.netExpenseAllowance.setValue(data.renumeration.netCostReimbursment);


      if (this.nettoggle === true) {
        this.PersonPositionForm.controls.netExpenseAllowance.enable();
      }
      else {
        this.PersonPositionForm.controls.netExpenseAllowance.disable();
      }

      this.changeMessage();
    }
    else {
          this.DpsPersonObject.renumeration = new Renumeration();          
          this.DpsPersonObject.renumeration.costReimbursment = this.nettoggle;
          this.DpsPersonObject.renumeration.transportationAllowance = this.kmtoggle;
    }
  
    this.PersonPositionForm.controls.extra.setValue(data.addittionalInformation);
  
  }

  onChangeDropDownFunctie($event) {

    this.positionChosen = this.dataDropDownFunctie[$event.target.value];
    this.positionId =  this.getIdOfPosition(this.positionChosen);

    this.DpsPersonObject.customerPostionId = "" + this.positionId;
    this.changeMessage();

    //this.updatePosition();

  }

  updatePosition() {

    this.DpsPersonObject = this.message.data;
    this.DpsPersonObject.customerPostionId = "" + this.positionId;

    this.changeMessage();

  }

  changeKM($event) {

    if(this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
    if(this.DpsPersonObject.renumeration !== null && this.DpsPersonObject.renumeration !== undefined)
      {
        this.DpsPersonObject.renumeration.transportationAllowance = $event;
        this.changeMessage();
      }
  }

  onChangeDropDownStatute($event) {

    this.statuteChosen = "";
    if (this.DpsPersonObject !== null) {
      this.DpsPersonObject.statute = new Statute();
      this.DpsPersonObject.statute.name = this.statutes[$event.target.value].name;
      this.DpsPersonObject.statute.type = this.statutes[$event.target.value].type;
      this.DpsPersonObject.statute.brightStaffingID = this.statutes[$event.target.value].BrightStaffingID;

      this.changeMessage();
    }


  }

  addittionalInformation(value: string) {
    if(this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
      if(this.DpsPersonObject.renumeration !== null && this.DpsPersonObject.renumeration !== undefined)
        {
          this.DpsPersonObject.addittionalInformation = value;      
          this.changeMessage();
        }
  }

  onNetExpensesReceive(netExpenseAllowance: number) {
    if(this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
      if(this.DpsPersonObject.renumeration !== null && this.DpsPersonObject.renumeration !== undefined)
      {
        this.DpsPersonObject.renumeration.netCostReimbursment = netExpenseAllowance;
        this.changeMessage();    
      }
  }

  onHourlyWageReceive(grossHourlyWage: number) 
  {
    this.logger.log("dps person object");
    this.logger.log(this.DpsPersonObject);

    if(grossHourlyWage >=5)
    {
      this.logger.log("dps person object if");
      if(this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
      {
        if(this.DpsPersonObject.renumeration !== null && this.DpsPersonObject.renumeration !== undefined)
        {
          this.DpsPersonObject.renumeration.hourlyWage = grossHourlyWage;
          this.changeMessage();  
        }
      }
    }
    else 
    {
      this.logger.log("dps person object else");
      if(this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
      {
        if(this.DpsPersonObject.renumeration !== null && this.DpsPersonObject.renumeration !== undefined)
        {
          this.PersonPositionForm.get('grossHourlyWage').setValue(5);
          this.DpsPersonObject.renumeration.hourlyWage = 5;
          this.changeMessage();  
        }
      }
    }

  }

}
