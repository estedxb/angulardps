import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public showFormIndex = 1;
  constructor() { }

  ngOnInit() {
  }

  onFormwardClick() {
    this.showFormIndex = 2;
  }

  onBackwardClick() {
    this.showFormIndex = 1;
  }

}
