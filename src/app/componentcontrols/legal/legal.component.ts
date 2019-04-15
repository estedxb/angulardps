import { Component, OnInit } from '@angular/core';
import { LegalForm } from '../../models/legalform';
import { LegalformService } from '../../shared/legalform.service';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent implements OnInit {
  public legalforms = [];
  public errorMsg;
  constructor(private legalformService: LegalformService) { }

  ngOnInit() {
    this.legalformService.getLegalForms().subscribe(data => this.legalforms = data , error => this.errorMsg = error);
  }

}
