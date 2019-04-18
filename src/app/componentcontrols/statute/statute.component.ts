import { Component, OnInit } from '@angular/core';
import { StatuteService } from '../../shared/statute.service';
import { $ } from 'jquery';
@Component({
  selector: 'app-statute',
  templateUrl: './statute.component.html',
  styleUrls: ['./statute.component.css']
})
export class StatuteComponent implements OnInit {
  public statutes = [];
  public errorMsg;
  public isMealEnabled = [];
  public statutename ='';
  constructor(private statuteService: StatuteService) { }
  ngOnInit() {
    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;
      this.isMealEnabled = new Array<number>(data.length);
      // this.isMealEnabled[2] = true;
      // tslint:disable-next-line: prefer-for-of
      for (let Cnt = 0; Cnt < data.length; Cnt++) {
        this.isMealEnabled[Cnt] = data[Cnt].mealstatus;
        // alert(this.isMealEnabled[Cnt] );
      }
    }, error => this.errorMsg = error);
  }
  onChange(event, ctrlid: number){
    try {
      this.isMealEnabled[ctrlid] = event; // alert('this.isMealEnabled[' + ctrlid + '] = ' + this.isMealEnabled[ctrlid]);
    } catch(ex){
      alert(ex.message);
    }
  }

}
