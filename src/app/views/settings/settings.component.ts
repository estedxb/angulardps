import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public SelectedPage = 'Settings';
  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

}
