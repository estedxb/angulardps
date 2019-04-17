import { Component, OnInit } from '@angular/core';
import { LegalformService } from '../../shared/legalform.service';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent implements OnInit {
  public legalforms = [];
  public legalformslang = [];
  public currentlanguage = 'nl';

  public errorMsg;

  constructor(private legalformService: LegalformService) { }

  ngOnInit() {
    this.legalformService.getLegalForms().subscribe(data => {
      this.legalforms = data;
      this.legalformslang = data[this.currentlanguage];
    }, error => this.errorMsg = error);
  }
}
