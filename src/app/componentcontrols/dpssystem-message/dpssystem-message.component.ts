import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { ErrorMSG } from '../../shared/models';

@Component({
  selector: 'app-dpssystem-message',
  templateUrl: './dpssystem-message.component.html',
  styleUrls: ['./dpssystem-message.component.css']
})
export class DPSSystemMessageComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ErrorMSG) { }

  ngOnInit() {
    this.data.MSG = this.data.MSG.replace(/\n/g, '<br />');
  }
}
