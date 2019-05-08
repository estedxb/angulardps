import { Component, OnInit, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-personposition',
  templateUrl: './personposition.component.html',
  styleUrls: ['./../person.component.css']
})
export class PersonPositionComponent implements OnInit {
  @Input() SocialSecurityId: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
  }

}
