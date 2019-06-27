import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dpssystem-message',
  templateUrl: './dpssystem-message.component.html',
  styleUrls: ['./dpssystem-message.component.css']
})
export class DPSSystemMessageComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

}
