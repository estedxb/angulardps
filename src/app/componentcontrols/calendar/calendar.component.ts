import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { calendar } from 'ngx-bootstrap/chronos/moment/calendar';
import { LoggingService } from '../../shared/logging.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  set selectedValue(value: any) { this._selectedValuedays = value; }
  get selectedValue(): any { return this._selectedValuedays; }
  set selectedIndex(value: number) { this._selectedIndexdays = value; this.value = this.dataDropDown[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndexdays; }
  set value(value: any) { this._daysvalue = value; }
  get value(): any { return this._daysvalue; }
  set selectedValueMonth(value: any) { this._selectedValueMonth = value; }
  get selectedValueMonth(): any { return this._selectedValueMonth; }
  set selectedIndexMonth(value: number) { this._selectedIndexMonth = value; this.value = this.dropDownMonth[this.selectedIndexMonth]; }
  get selectedIndexMonth(): number { return this._selectedIndexMonth; }
  set valueMonth(value: any) { this._selectedValueMonth = value; }
  get valueMonth(): any { return this._selectedValueMonth; }
  set selectedValueYear(value: any) { this._selectedValueYear = value; }
  get selectedValueYear(): any { return this._selectedValueYear; }
  set selectedIndexYear(value: number) { this._selectedIndexYear = value; this.value = this.dropDownYear[this.selectedIndexYear]; }
  get selectedIndexYear(): number { return this._selectedIndexYear; }
  set valueYear(value: any) { this._selectedValueYear = value; }
  get valueYear(): any { return this._selectedValueYear; }

  constructor(private logger: LoggingService) {

    const today: Date = new Date();
    this.dataDropDown = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    this.dropDownMonth = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'october', 'november', 'december'];
    this.selectedYear = 0;
    this.dropDownYear = [];

    if (this.componentType === "Contract")
      this.dropDownYear = ['' + today.getFullYear(), '' + (today.getFullYear() + 1)];
    else {
      for (let i: number = 1900; i <= 2020; i++)
        this.dropDownYear.push("" + i);
    }


    this.calendarObject = {
      dayString: '1',
      monthString: '1',
      yearString: '2019'
    };

    this.logger.log('calendar data received=' + this.CalendarData);
  }

  @Input() public CalendarData: string;
  @Input() public disableAll: boolean;
  @Input() public calendarDisableStatus = null;
  @Input() public calendardayDisableStatus = null;
  @Input() public calendarmonthDisableStatus = null;
  @Input() public calendaryearDisableStatus = null;
  @Input() public componentType = null;
  @Output() public childEvent = new EventEmitter();

  public dataDropDown: string[];
  public dropDownMonth: string[];
  public dropDownYear: Array<string>;
  public dayString;
  public monthString;
  public yearString;
  public selectedMonth;
  public selectedIndexDays;
  public selectedYear;
  public calendarObject: any;
  public oldCalendarData: string;
  public dayDisableStatus = null;
  public monthDisableStatus = null;
  public yearDisableStatus = null;

  /***** Drop Down functions and variables for calendar days  ********************************************/
  private _selectedValuedays: any; private _selectedIndexdays: any = 0; private _daysvalue: any;

  /***** Drop Down functions and variables for calendar months  ********************************************/
  private _selectedValueMonth: any; private _selectedIndexMonth: any = 0; private _monthvalue: any;

  /***** Drop Down functions and variables for calendar year  ********************************************/
  private _selectedValueYear: any; private _selectedIndexYear: any = 0; private _yearvalue: any;
  resetToInitValue() { this.value = this.selectedValue; }
  SetInitialValue() { if (this.selectedValue === undefined) { this.selectedValue = this.dataDropDown[this.selectedIndex]; } }
  resetToInitValueMonth() { this.value = this.selectedValueMonth; }
  SetInitialValueMonth() { if (this.selectedValueMonth === undefined) { this.selectedValueMonth = this.dropDownMonth[this.selectedIndexMonth]; } }
  resetToInitValueYear() { this.value = this.selectedValueYear; }
  SetInitialValueYear() { if (this.selectedValueYear === undefined) { this.selectedValueYear = this.dropDownYear[this.selectedIndexYear]; } }

  ngDoCheck() {

    if (this.CalendarData !== this.oldCalendarData) {
      this.oldCalendarData = this.CalendarData;
      this.loadDOBData(this.CalendarData);
    }

    if (this.disableAll === true) {
      this.dayDisableStatus = true;
      this.monthDisableStatus = true;
      this.yearDisableStatus = true;
    }
    else {
      this.dayDisableStatus = false;
      this.monthDisableStatus = false;
      this.yearDisableStatus = false;
    }

    if (this.calendarDisableStatus === true) {
      // this.logger.log('in');
      this.dayDisableStatus = true;
      this.monthDisableStatus = true;
      this.yearDisableStatus = true;
    } else {
      // this.logger.log('out');
      this.dayDisableStatus = this.calendardayDisableStatus;
      this.monthDisableStatus = this.calendarmonthDisableStatus;
      this.yearDisableStatus = this.calendaryearDisableStatus;
    }

  }

  loadDOBDataNew(calendarData) {

    const calendarArray = calendarData.split('/');
    let yearString = 0;

    let currentYear = (new Date()).getFullYear() % 100;

    if (parseInt(calendarArray[2], 10) >= 0 && parseInt(calendarArray[2], 10) <= currentYear)
      yearString = parseInt(calendarArray[2], 10) + 2000;
    else
      yearString = (parseInt(calendarArray[2], 10) + 1900);

    this.selectedIndex = parseInt(calendarArray[0], 10);
    this.selectedMonth = parseInt(calendarArray[1], 10) - 1;

    for (let i = 0; i < this.dropDownYear.length; i++) {
      if (yearString.toString() === this.dropDownYear[i])
        this.selectedYear = i;
    }

  }

  loadDOBData(calendarData) {

    const calendarArray = calendarData.split('/');

    this._selectedIndexdays = parseInt(calendarArray[0], 10);
    this.selectedMonth = parseInt(calendarArray[1], 10) - 1;
    this._selectedIndexYear = parseInt(calendarArray[2], 10);

    this.calendarObject.dayString = "" + calendarArray[0];
    this.calendarObject.monthString = "" + calendarArray[1];
    this.calendarObject.yearString = "" + calendarArray[2];

    this.selectedYear = this.findIndex(parseInt(calendarArray[2], 10));

  }

  findIndex(yearString) {

    for (let i: number = 0; i < this.dropDownYear.length; i++) {
      if (yearString === parseInt(this.dropDownYear[i], 10))
        return i;
    }

    return -1;
  }

  checkLeapYear(year: number): boolean {
    // If a year is multiple of 400,
    // then it is a leap year
    if (year % 400 == 0) {
      return true;
    }

    // Else If a year is muliplt of 100,
    // then it is not a leap year
    if (year % 100 == 0) {
      return false;
    }

    // Else If a year is muliplt of 4,
    // then it is a leap year
    if (year % 4 == 0) {
      return true;
    }
    return false;
  }

  changeDropDownDateArray(event) {

    const month: string = event;
    this.logger.log('selected month=' + month);

    this.dataDropDown = [];

    const currentYear = parseInt(this.dropDownYear[this.selectedYear], 10);
    this.logger.log('currentYear=' + currentYear);

    if (month === '1') {
      let noDays = 28;

      if (this.checkLeapYear(currentYear)) {
        noDays = 29;
      }

      for (let i = 1; i <= noDays; i++) {
        this.dataDropDown.push('' + i);
      }
    } else
      if (month === '11' || month === '0' || month === '4' || month === '6' || month === '7' || month === '9' || month === '2') {
        for (let i = 1; i <= 31; i++) {
          this.dataDropDown.push('' + i);
        }
      } else {
        for (let i = 1; i <= 30; i++) {
          this.dataDropDown.push('' + i);
        }
      }

  }

  onChangeDropDownYear($event) {
    this.yearString = this.dropDownYear[$event.target.value];
    this.selectedYear = $event.target.value;

    this.calendarObject.yearString = this.yearString;
    this.childEvent.emit(this.calendarObject);

  }

  onChangeDropDownMonth($event) {
    this.changeDropDownDateArray($event.target.value);
    this.monthString = this.dropDownMonth[$event.target.value];
    this.calendarObject.monthString = this.monthString;
    this.childEvent.emit(this.calendarObject);
  }

  onChangeDropDownDate($event) {
    this.dayString = this.dataDropDown[$event.target.value - 1];
    this.calendarObject.dayString = this.dayString;

    this.childEvent.emit(this.calendarObject);
  }

  ngOnInit() {
  }
}
