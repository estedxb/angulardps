import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public dataDropDown:String[];
  public dropDownMonth:string[];
  public dropDownYear:Array<string>;
  public dayString;
  public monthString;
  public yearString;
  public selectedMonth;
  public selectedIndexDays;
  public selectedYear;  

   /***** Drop Down functions and variables for calendar days  ********************************************/
   private _selectedValuedays: any; private _selectedIndexdays: any = 0; private _daysvalue: any;
   set selectedValue(value: any) {  this._selectedValuedays = value; }
   get selectedValue(): any { return this._selectedValuedays; }
   set selectedIndex(value: number) { this._selectedIndexdays = value; this.value = this.dataDropDown[this.selectedIndex]; }
   get selectedIndex(): number { return this._selectedIndexdays; }
   set value(value: any) { this._daysvalue = value; }
   get value(): any { return this._daysvalue; }
   resetToInitValue() { this.value = this.selectedValue; }
   SetInitialValue() { if (this.selectedValue === undefined) {   this.selectedValue = this.dataDropDown[this.selectedIndex]; }}
 
   /***** Drop Down functions and variables for calendar months  ********************************************/
   private _selectedValueMonth: any; private _selectedIndexMonth: any = 0; private _monthvalue: any;
   set selectedValueMonth(value: any) {  this._selectedValueMonth = value; }
   get selectedValueMonth(): any { return this._selectedValueMonth; }
   set selectedIndexMonth(value: number) { this._selectedIndexMonth = value; this.value = this.dropDownMonth[this.selectedIndexMonth]; }
   get selectedIndexMonth(): number { return this._selectedIndexMonth; }
   set valueMonth(value: any) { this._selectedValueMonth = value; }
   get valueMonth(): any { return this._selectedValueMonth; }
   resetToInitValueMonth() { this.value = this.selectedValue; }
   SetInitialValueMonth() { if (this.selectedValueMonth === undefined) {   this.selectedValueMonth = this.dropDownMonth[this.selectedIndexMonth]; }}
 
   /***** Drop Down functions and variables for calendar year  ********************************************/
   private _selectedValueYear: any; private _selectedIndexYear: any = 0; private _yearvalue: any;
   set selectedValueYear(value: any) {  this._selectedValueYear = value; }
   get selectedValueYear(): any { return this._selectedValueYear; }
   set selectedIndexYear(value: number) { this._selectedIndexYear = value; this.value = this.dropDownYear[this.selectedIndexYear]; }
   get selectedIndexYear(): number { return this._selectedIndexYear; }
   set valueYear(value: any) { this._selectedValueYear = value; }
   get valueYear(): any { return this._selectedValueYear; }
   resetToInitValueYear() { this.value = this.selectedValue; }
   SetInitialValueYear() { if (this.selectedValueYear === undefined) {   this.selectedValueYear = this.dropDownYear[this.selectedIndexYear]; }}

  constructor() {

    let today:Date = new Date();
    this.dropDownYear = [""+today.getFullYear(),""+(today.getFullYear() +1)];
    this.dataDropDown = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
    this.dropDownMonth = ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];

   }

   checkLeapYear(year:number):boolean  
    {  
        // If a year is multiple of 400,  
        // then it is a leap year  
        if (year % 400 == 0)  
            return true;  
      
        // Else If a year is muliplt of 100,  
        // then it is not a leap year  
        if (year % 100 == 0)  
            return false;  
      
        // Else If a year is muliplt of 4,  
        // then it is a leap year  
        if (year % 4 == 0)  
            return true;  
        return false;  
    }

   changeDropDownDateArray(event) {

    let month:string = event;
    console.log("selected month="+month);

    this.dataDropDown = [];

    let currentYear = parseInt(this.dropDownYear[this.selectedYear],10);
    console.log("currentYear="+currentYear);

    if(month==="1")
    {
      let noDays = 28;

      if(this.checkLeapYear(currentYear))
        noDays = 29;

      for(let i:number=1;i<=noDays;i++)
        this.dataDropDown.push(""+i);
    }
    else
      if(month==="11"  || month==="0"  || month==="4" || month==="6" || month==="7" || month==="9" || month==="2")
      {
        for(let i:number=1;i<=31;i++)
            this.dataDropDown.push(""+i);
      }
      else
      {
          for(let i:number=1;i<=30;i++)
              this.dataDropDown.push(""+i);
      }

  }

  onChangeDropDownYear($event) {
    this.yearString = $event.value;    
  }

  onChangeDropDownMonth($event){
    
    console.log("selected month="+$event.target.value);
    this.changeDropDownDateArray($event.target.value);
    this.monthString = $event.value;

  }

  onChangeDropDownDate($event){
    this.dayString = $event.value;
  }

  ngOnInit() {

  }
}