import { Component, OnInit } from '@angular/core';
import { ParitairCommitee } from '../../shared/models';
import { JointcommitteeService } from '../../shared/jointcommittee.service';
//import { $ } from 'jquery';

@Component({
  selector: 'app-jointcommittee',
  templateUrl: './jointcommittee.component.html',
  styleUrls: ['./jointcommittee.component.css']
})

export class JointcommitteeComponent implements OnInit {
  public jointCommittees = [];
  public id = 'ddl_jointcommittee' ;
  public Value: ParitairCommitee  ;
  public errorMsg;
  constructor(private jointcommitteeService: JointcommitteeService) { }

  ngOnInit() {
    this.jointcommitteeService.getJointCommitees().subscribe(data => this.jointCommittees = data , error => this.errorMsg = error);
  }

  onChange($event) {
    console.log(this.id);
    this.Value = this.jointCommittees[$event.target.value];
    console.log('Joint Committees Selected Data ::');
    console.log(this.Value);
    //alert( this.Value);
    return this.Value;
  }
}