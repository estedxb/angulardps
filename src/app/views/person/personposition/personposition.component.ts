import { Component, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-personposition',
  templateUrl: './personposition.component.html',
  styleUrls: ['./../person.component.css']
})
export class PersonPositionComponent implements OnInit {

  constructor() { }


  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
  }

}
