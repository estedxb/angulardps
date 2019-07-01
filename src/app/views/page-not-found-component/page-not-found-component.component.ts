import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-page-not-found-component',
  templateUrl: './page-not-found-component.component.html',
  styleUrls: ['./page-not-found-component.component.css']
})
export class PageNotFoundComponentComponent implements OnInit {
  public positionid = 2;
  public locationid = 2;
  public username = 'lewis@esteinternational.com';
  constructor(
    // private spinner: NgxUiLoaderService
  ) { }

  ngOnInit() {
  }

}
