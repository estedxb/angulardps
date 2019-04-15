import { Component, OnInit } from '@angular/core';
import { JointCommittee } from '../../models/jointcommittee';
import { JointcommitteeService } from '../../shared/jointcommittee.service';

@Component({
  selector: 'app-jointcommittee',
  templateUrl: './jointcommittee.component.html',
  styleUrls: ['./jointcommittee.component.css']
})

export class JointcommitteeComponent implements OnInit {
  public jointCommittees = [];
  public errorMsg;
  constructor(private jointcommitteeService: JointcommitteeService) { }
  ngOnInit() {
    this.jointcommitteeService.getJointCommitees().subscribe(data => this.jointCommittees = data , error => this.errorMsg = error);
  }
}