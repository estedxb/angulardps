import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cancelcontract',
  templateUrl: './cancelcontract.component.html',
  styleUrls: ['./cancelcontract.component.css']
})
export class CancelcontractComponent implements OnInit {
  @Output() showmsg = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
  }

}
