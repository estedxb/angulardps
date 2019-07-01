import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public SelectedPage = 'Settings';
  constructor(
    // private spinner: NgxUiLoaderService
  ) { }

  ngOnInit() {
  }

}
