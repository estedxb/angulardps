import { Component, OnInit } from '@angular/core';
import { WorkCodesService } from '../../shared/workcodes.service';

@Component({
  selector: 'app-workcodes',
  templateUrl: './workcodes.component.html',
  styleUrls: ['./workcodes.component.css']
})
export class WorkCodesComponent implements OnInit {
  public workcodes = [];
  public errorMsg;
  constructor(private workCodesService: WorkCodesService) { }
  ngOnInit() {
    this.workCodesService.getWorkCodes().subscribe(data => this.workcodes = data , error => this.errorMsg = error);
  }
}
