import { Component, OnInit, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl} from '@angular/forms';
import { DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck, 
  PhoneNumber, Address,StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance, 
  InvoiceSettings, Language, Contact } from '../shared/models';

@Component({
  selector: 'app-invoice-settings',
  templateUrl: './invoice-settings.component.html',
  styleUrls: ['./invoice-settings.component.css']
})
export class InvoiceSettingsComponent implements OnInit {

  @Input() addRow: string;
  public disabled="false";
  public addNewRow:boolean;
  public removeLastRemove:boolean;

  lieuDaysAllowanceObject: LieuDaysAllowance;
  sicknessInvoiced: boolean;
  holidayInvoiced: boolean;
  mobilityAllowanceObject: MobilityAllowance;
  shiftAllowance: boolean;
  shiftAllowances: ShiftAllowance[];
  otherAllowances: OtherAllowance[];

  public ISForm: FormGroup

  public form: FormGroup;
  public Ploegpremiere: FormArray;  

  public formNew: FormGroup;
  public Andre:FormArray;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.lieuDaysAllowanceObject = new LieuDaysAllowance();
    this.mobilityAllowanceObject = new MobilityAllowance();
    this.shiftAllowances= [];
    this.otherAllowances = [];

    this.ISForm = new FormGroup({

      inhaalrust: new FormControl(''),
      mobilebox: new FormControl(''),
      PloegprimeBox1: new FormControl(''),
      PloegprimeBox2: new FormControl(''),
      PloegprimeBox3: new FormControl(''),
      arrayBox: this.fb.array([
        this.createFirstServant()
      ]),
      AndreBox1:new FormControl(''),
      AndreBox2:new FormControl(''),
      AndreBox3: new FormControl(''),
      arrayAndreBox: this.fb.array([
        this.createAndre()
      ])
    });
  
  // set Ploegpremiere to the form control containing contacts
    this.Ploegpremiere = this.ISForm.get('arrayBox') as FormArray;
    this.Andre = this.ISForm.get('arrayAndreBox') as FormArray;
  }

  onChangeZ(event) {
    this.sicknessInvoiced = event;
    console.log("value="+event);
  }
  onChangef(event) {
    this.holidayInvoiced = event;
    console.log("value"+event);
  }

  onChangem(event){
    this.holidayInvoiced = event;
    console.log("value"+event);
  }

  onChangeI(event){
  }

  onMealM(event){

  }

  onChangeR(event){

  }


  createAndre(): FormGroup {
    this.addNewRow = false;
    this.removeLastRemove = true;

    return this.fb.group({
      AndreBox1: new FormControl(''),
      AndreBox2: new FormControl(''),
      AndreBox3: new FormControl(''),
    });

  }

  createFirstServant(): FormGroup {
    this.addNewRow = false;
    this.removeLastRemove = true;

    return this.fb.group({
      PloegprimeBox1: new FormControl(''),
      PloegprimeBox2: new FormControl(''),
      PloegprimeBox3: new FormControl(''),
    });
  }

  createServants(): FormGroup {
    this.addNewRow = false;
    this.removeLastRemove = false;

    return this.fb.group({
      PloegprimeBox1: new FormControl(''),
      PloegprimeBox2: new FormControl(''),
      PloegprimeBox3: new FormControl(''),
    });

  }

  get arrayAndreBox() {
    return this.Andre.get('arrayAndreBox') as FormArray;
  }

  addAndreRows() {
    this.Andre.push(this.createAndre());
  }

  removeAndreRows(index) {
    if(this.Andre.length != 1)
      this.Andre.removeAt(index);
  }


  get arrayBox() {
    return this.Ploegpremiere.get('arrayBox') as FormArray;
  }

  addRows() {
    this.Ploegpremiere.push(this.createServants());
  }

  removeRows(index) {
    if(this.Ploegpremiere.length != 1)
      this.Ploegpremiere.removeAt(index);
  }

  replaceRows(index){
  
  }

}




