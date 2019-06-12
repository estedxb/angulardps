import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { LegalForm, Forms } from '../../shared/models';
import { LegalformService } from '../../shared/legalform.service';
import { LanguagesService } from '../../shared/languages.service';
import { LoggingService } from '../../shared/logging.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styles: ['select {width:100%;}']
})
export class LanguagesComponent implements OnInit {

  @Input() public LanguageFormData: string;
  @Output() public childEvent = new EventEmitter();

  public id = 'ddl_languages';
  public currentlanguage = 'nl';
  public errorMsg;
  public maindatas: any = [];
  private datas: any = [];
  public oldLanguageFormData: string;

  // tslint:disable-next-line: variable-name
  private _selectedValue: any; private _selectedIndex: any = 0; private _value: any;

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
    this.logger.log('language=' + this.value);
    this.childEvent.emit(this.value);
    return this.value;

  }

  constructor(private languagesService: LanguagesService, private logger: LoggingService) { }

  ngDoCheck() {

    this.logger.log('inside ngDoCheck=' + this.LanguageFormData);

    if (this.LanguageFormData !== undefined && this.LanguageFormData !== null) {
      this.logger.log('languageFormData=' + this.LanguageFormData);
      if (this.LanguageFormData != this.oldLanguageFormData) {
        this.oldLanguageFormData = this.LanguageFormData;
        this.loadInitialData(this.datas);
      }
    }

  }


  ngOnInit() {
    this.logger.log('inside ngOnInit=' + this.LanguageFormData);
    this.languagesService.getLanguages().subscribe(languages => {
      this.datas = languages;
      this.loadInitialData(this.datas);
      this.logger.log('Languages Data : ');
      this.logger.log(this.datas);
    }, error => this.errorMsg = error);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }
  }

  ngAfterViewInit() {
    this.logger.log('inside ngDoAfterViewInit=' + this.LanguageFormData);

    if (this.LanguageFormData !== undefined && this.LanguageFormData !== null) {
      if (this.LanguageFormData !== this.oldLanguageFormData) {
        this.oldLanguageFormData = this.LanguageFormData;
        this.loadInitialData(this.datas);
      }
    }
  }

  loadInitialData(datas) {

    this.logger.log('language String=' + this.LanguageFormData);

    if (datas.length !== 0) {
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].name === this.LanguageFormData) {
          this._selectedIndex = i;
        }
      }
      this.logger.log('selected index=' + this._selectedIndex);
    } else {
      this.logger.log('null or undefined');
    }

  }
}

