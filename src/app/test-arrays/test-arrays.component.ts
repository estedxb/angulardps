import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StatuteService } from '../shared/statute.service';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, ControlContainer } from '@angular/forms';
import { Statute } from '../shared/models';
import { addSubtract } from 'ngx-bootstrap/chronos/moment/add-subtract';

@Component({
  selector: 'app-test-arrays',
  templateUrl: './test-arrays.component.html',
  // styleUrls: ['./test-arrays.component.css']
  styles: ['.row{margin-right:0px;margin-left:0px;} .row.panelheader{margin-right:-15px;margin-left:-15px;}']

})
export class TestArraysComponent implements OnInit {

  SForm:FormGroup;

  public statutes = [];
  public isMealEnabled = [];
  public countStatutes: number;
  public errorMsg:string;

  constructor(private statuteService:StatuteService,private fb:FormBuilder) { }

  ngOnInit() {

    this.SForm = new FormGroup({      
      statuteArray: this.fb.array([])
    });

    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;

      this.isMealEnabled = new Array<number>(data.length);
      this.countStatutes = data.length;

      if (this.statutes.length !== 0) {
        this.createStatuteArray();
      }

    }, error => this.errorMsg = error);

  }

  createControls(name,Coefficient,TotalWorth,EmployerShare,MinimumHours) {

   return this.fb.group({
      name: new FormControl(name),
      CoefficientBox: new FormControl(Coefficient, [Validators.required, Validators.pattern('^[0-9]$')]),
      arrayBox: this.fb.array([
        this.createBox(TotalWorth,EmployerShare,MinimumHours)
      ]),
    });

  }

  createBox(TotalWorth,EmployerShare,MinimumHours) {

    return this.fb.group({
      TotalWaarde: new FormControl(TotalWorth),
      Wergeversdeel: new FormControl(EmployerShare),
      minimumHours: new FormControl(MinimumHours)
    });

  }
   
  createStatuteArray() {

    var arrayData = [
      {
          "Statute": {
              "Name": "Arbeider",
              "Type": "Blue"
          },
          "ParitairCommitee": {
              "Number": "100",
              "Name": "aanvullend pc arbeiders",
              "Type": "blue",
              "BrightStaffingId": null
          },
          "Coefficient": 1,
          "MealVoucherSettings": {
              "TotalWorth": 12,
              "EmployerShare": 12,
              "MinimumHours": 123
          }
      },
      {
          "Statute": {
              "Name": "Bediende",
              "Type": "White"
          },
          "ParitairCommitee": {
              "Number": "101",
              "Name": "nationale gemengde mijncommissie",
              "Type": "blue",
              "BrightStaffingId": null
          },
          "Coefficient": 34,
          "MealVoucherSettings": {
              "TotalWorth": 20,
              "EmployerShare": 10,
              "MinimumHours": 30
          }
      },
      {
          "Statute": {
              "Name": "Jobstudent Arbeider",
              "Type": "Blue"
          },
          "ParitairCommitee": {
              "Number": "102",
              "Name": "groefbedrijf",
              "Type": "blue",
              "BrightStaffingId": null
          },
          "Coefficient": 3,
          "MealVoucherSettings": {
              "TotalWorth": 0,
              "EmployerShare": 0,
              "MinimumHours": 0
          }
      },
      {
          "Statute": {
              "Name": "Flexijob Arbeider",
              "Type": "Blue"
          },
          "ParitairCommitee": {
              "Number": "102.01",
              "Name": "hardsteengroeven en der groeven van uit te houwen kalksteen in de provincie hene",
              "Type": "blue",
              "BrightStaffingId": null
          },
          "Coefficient": 2,
          "MealVoucherSettings": {
              "TotalWorth": 5,
              "EmployerShare": 4,
              "MinimumHours": 3
          }
      },
      {
          "Statute": {
              "Name": "Seizoensarbeider",
              "Type": "Blue"
          },
          "ParitairCommitee": {
              "Number": "102.02",
              "Name": "hardsteengroeven en der groeven van uit te houwen kalksteen in de provincies lui",
              "Type": "blue",
              "BrightStaffingId": null
          },
          "Coefficient": 1,
          "MealVoucherSettings": {
              "TotalWorth": 0,
              "EmployerShare": 0,
              "MinimumHours": 0
          }
      },
      {
          "Statute": {
              "Name": "Gelegenheidsarbeider horeca",
              "Type": "Blue"
          },
          "ParitairCommitee": {
              "Number": "102.03",
              "Name": "porfiergroeven",
              "Type": "blue",
              "BrightStaffingId": null
          },
          "Coefficient": 5,
          "MealVoucherSettings": {
              "TotalWorth": 0,
              "EmployerShare": 0,
              "MinimumHours": 0
          }
      },
      {
          "Statute": {
              "Name": "Jobstudent Bediende",
              "Type": "White"
          },
          "ParitairCommitee": {
              "Number": "102.04",
              "Name": "zandsteen- en kwartsietgroeven",
              "Type": "blue",
              "BrightStaffingId": null
          },
          "Coefficient": 4,
          "MealVoucherSettings": {
              "TotalWorth": 10,
              "EmployerShare": 10,
              "MinimumHours": 10
          }
      },
      {
          "Statute": {
              "Name": "Flexijob Bediende",
              "Type": "White"
          },
          "ParitairCommitee": {
              "Number": "102.05",
              "Name": "porseleinaarde- en zandgroeven welke in openlucht geëxploiteerd worden",
              "Type": "blue",
              "BrightStaffingId": null
          },
          "Coefficient": 3,
          "MealVoucherSettings": {
              "TotalWorth": 20,
              "EmployerShare": 20,
              "MinimumHours":20
          }
      }
  ];

    for(let i=0;i<this.statutes.length;i++) {
      this.addControls(this.statutes[i].name,arrayData[i].Coefficient,arrayData[i].MealVoucherSettings.TotalWorth,arrayData[i].MealVoucherSettings.EmployerShare,arrayData[i].MealVoucherSettings.MinimumHours);
    }

  }

  addControls(name,Coefficient,TotalWorth,EmployerShare,MinimumHours) {
    this.statuteArray.push(this.createControls(name,Coefficient,TotalWorth,EmployerShare,MinimumHours));
  }
  
  get statuteArray() {
    return this.SForm.get('statuteArray') as FormArray;
  }

  addArray() {
    //this.arrayBox.push(this.createBox());
  }

  get arrayBox() {
    return this.SForm.get('arrayBox') as FormArray;
  }


 onMealChange(event, ctrlid: number) {
  try {
    this.isMealEnabled[ctrlid] = event;
  } catch (ex) {
    alert(ex.message);
  }
}

totalChange(value: number, i) {

  if(this.isMealEnabled[i]===true)
  {
    console.log("totalwaarde value and i:"+value+"  "+ i);
  }
}

WergeversdeelChange(value: number, i) {
  if(this.isMealEnabled[i]===true)
  {
    console.log("WergeversdeelChange value and i:"+value+"  "+ i);
  }
}

minimumUrenChange(value: number, i) {
  if(this.isMealEnabled[i]===true)
  {
    console.log("minimumUrenChange value and i:"+value + " "+i);
  }
}

onChangeCoefficient(value,i){

}

}