import { Component, OnInit } from '@angular/core';
import { StatuteService } from '../../shared/statute.service';

@Component({
  selector: 'app-statute',
  templateUrl: './statute.component.html',
  styleUrls: ['./statute.component.css']
})
export class StatuteComponent implements OnInit {
  public statutes = [];
  public errorMsg;
  public isMealEnabled?:boolean;
  public statutename ='';
  constructor(private statuteService: StatuteService) { }
  ngOnInit() {
    this.statuteService.getStatutes().subscribe(data => this.statutes = data , error => this.errorMsg = error);
  }
  onChangeEvent(event:any){
    alert('hi');
  }
  onValueChange(event){
    //this.isMealEnabled = event;
    //alert(this.isMealEnabled);
    alert('hi');
    /*
    console.log(event, event.toString(), JSON.stringify(event));
    try{
      this.isMealEnabled = event;
      alert(this.statutename);
      this.statutename = event.explicitOriginalTarget.id;
      alert(this.statutename);
      //this.statutename + '_details'
    }catch(ex){
      alert(ex.message);
    }
    */
  }
}
