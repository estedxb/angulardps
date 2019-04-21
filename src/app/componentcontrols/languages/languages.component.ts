import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
// import { LegalForm, Forms } from '../../shared/models';
import { LegalformService } from '../../shared/legalform.service';
import { LanguagesService } from '../../shared/languages.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css']
})
export class LanguagesComponent implements OnInit {

 @Input() public LanguageFormData;
 @Output() public childEvent = new EventEmitter();

  public id = 'ddl_languages' ;
  public currentlanguage = 'nl';
  public errorMsg;
  public maindatas: any = [];
  private datas: any = [];

  // tslint:disable-next-line: variable-name
  private _selectedValue: any ; private _selectedIndex: any = 0;  private _value: any ;

  set selectedValue(value: any) { this._selectedValue = value; }
  get selectedValue(): any { return this._selectedValue; }
  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.datas[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndex; }
  set value(value: any) { this._value = value; }
  get value(): any { return this._value; }
  resetToInitValue() { this.value = this.selectedValue; }
  SetInitialValue() { if (this.selectedValue === undefined) { this.selectedValue = this.datas[this.selectedIndex]; } }
  onChange($event) {

    this.selectedIndex = $event.target.value; 

    console.log('language='+this.value);
    this.childEvent.emit(this.value);

    return this.value; 

  }

  constructor(private languagesService: LanguagesService) { }

  ngOnInit() {
    this.languagesService.getLanguages().subscribe(languages => {
      this.datas = languages;
      console.log('Languages Data : '); console.log(this.datas);
    }, error => this.errorMsg = error);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }
  }
}

